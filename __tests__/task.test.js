const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');
const { mockUser, mockUserId, mockTasks, setupDatabase } = require('../fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send({
            description: 'Super Test Task'
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.description).toEqual('Super Test Task');
    expect(task.completed).toEqual(false);
});

test('Should get all tasks for user one', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});

test('Should not allow user to delete another users task(s)', async () => {
    await request(app)
        .delete(`/tasks/${mockTasks[1]._id}`)
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(mockTasks[1]._id);
    expect(task).not.toBeNull();
});