require('../db/mongoose');
const Task = require('../models/Task');

// Task.findOneAndRemove({ _id: '5cdd61b5a18c72197ca4958e' })
//     .then(task => {
//         console.log(task);
//         return Task.countDocuments({ completed: false });
//     }).then(result => {
//         console.log(result);
//     }).catch(e => console.log(e));

const deleteTaskAndCount = async (id) => {
    const user = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
}

deleteTaskAndCount('5cdd615e649b1610a0bf42af')
    .then(count => console.log('No. of Incomplete Tasks:', count))
    .catch(e => console.log(e));