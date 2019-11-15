const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./Task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, { timestamps: true });

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function (next) {
    const user = this;
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_TOKEN);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.methods.toJSON = function (next) {
    const user = this;
    const { age, name, email, _id, __v } = user.toObject();
    return {
        age,
        name,
        email,
        _id,
        __v
    };
}

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Unable to login');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Unable to login');
    return user;
}

const User = mongoose.model('User', userSchema);

module.exports = User;