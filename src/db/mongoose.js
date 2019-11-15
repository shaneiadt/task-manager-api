const mongoose = require("mongoose");
const connectionURL = process.env.MONGO_DB_CONNECTION;

mongoose.set('useFindAndModify', false);

mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err);
});