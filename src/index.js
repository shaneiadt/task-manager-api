const express = require("express");
require('./db/mongoose');
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routers/User');
const taskRouter = require('./routers/Task');
const MAINTENANCE = false;

app.use((req, res, next) => {
    if (MAINTENANCE) return res.status(503).send('This site is currently in maintenance mode.');
    next();
});

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});