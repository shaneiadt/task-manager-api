require('../db/mongoose');
const User = require('../models/User');

// User.findByIdAndUpdate('5cdd6000b9fc421e60e44b0a', { age: 1 })
//     .then(user => {
//         console.log(user);
//         return User.countDocuments({ age: 1 });
//     }).then(result => {
//         console.log(result);
//     }).catch(e => console.log(e));


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}

updateAgeAndCount('5cdd6000b9fc421e60e44b0a', 2)
    .then(count => console.log('count', count))
    .catch(e => console.log(e));