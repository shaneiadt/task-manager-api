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
    const match = {}
    const sort = {}
    const { completed, limit, skip, sortBy } = req.query
    if (completed) {
        match.completed = (completed === 'true')
    }
    if(sortBy){
        const parts = sortBy.split(':')
        sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(limit),
                skip: parseInt(skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);
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