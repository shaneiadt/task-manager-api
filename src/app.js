const express = require("express");
require('./db/mongoose');
const app = express();
const userRouter = require('./routers/User');
const taskRouter = require('./routers/Task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;