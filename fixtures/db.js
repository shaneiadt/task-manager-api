const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

const mockUserId = new mongoose.Types.ObjectId();
const mockUser = {
    _id: mockUserId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56whatboiboom6699bovs',
    age: 27,
    tokens: [{
        token: jwt.sign({ _id: mockUserId.toString() }, process.env.JWT_TOKEN)
    }]
};

const mockUser2Id = new mongoose.Types.ObjectId();
const mockUser2 = {
    _id: mockUser2Id,
    name: 'John',
    email: 'john@example.com',
    password: 'asgaq4q34ewr',
    age: 55,
    tokens: [{
        token: jwt.sign({ _id: mockUser2Id.toString() }, process.env.JWT_TOKEN)
    }]
};

const mockTasks = [
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'Mock task one',
        owner: mockUserId
    },
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'Mock task two',
        owner: mockUser2Id
    },
    {
        _id: new mongoose.Types.ObjectId(),
        description: 'Mock task three',
        completed: true,
        owner: mockUserId
    }
];

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(mockUser).save();
    await new User(mockUser2).save();
    await new Task(mockTasks[0]).save();
    await new Task(mockTasks[1]).save();
    await new Task(mockTasks[2]).save();
}

module.exports = {
    mockUser,
    mockUserId,
    mockTasks,
    setupDatabase
}