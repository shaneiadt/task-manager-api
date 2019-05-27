const mongoose = require("mongoose");
const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.set('useFindAndModify', false);

mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) return console.log(err);
});