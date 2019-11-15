const request = require('supertest');
const app = require('../src/app');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../src/models/User');

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

beforeEach(async () => {
    await User.deleteMany();
    await new User(mockUser).save();
});

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            'name': 'Super Test',
            'email': 'super@test.com',
            'password': 'o0ivheroihg69'
        })
        .expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: { name: 'Super Test', email: 'super@test.com' },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe('o0ivheroihg69');
});

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: mockUser.email,
            password: mockUser.password
        })
        .expect(200);

    const user = await User.findById(response.body.user._id);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistant user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'fakeemail@email.com',
            password: mockUser.password
        })
        .expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .attach('avatar', '__tests__/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(mockUserId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${mockUser.tokens[0].token}`)
        .send({
            'name': 'JohnJoe'
        })
        .expect(200);

    // const user = await User.findById(mockUserId)
});