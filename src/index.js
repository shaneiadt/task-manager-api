const express = require("express");
require('./db/mongoose');
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./routers/User');
const taskRouter = require('./routers/Task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});