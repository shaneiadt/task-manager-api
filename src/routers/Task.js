const express = require("express");
const Task = require('../models/Task');
const router = new express.Router();
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e)
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const { id: _id } = req.params;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdatesArray = ['description', 'completed'];
    const isValid = updates.every(update => allowedUpdatesArray.includes(update));

    if (!isValid) return res.status(400).send({ error: 'Invalid updates' });

    const { id: _id } = req.params;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) return res.status(404).send();

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const { id: _id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
        if (!task) return res.status(404).send();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;