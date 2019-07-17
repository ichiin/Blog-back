const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({
    username:{
        type: String
    },
    password:{
        type: String
    },
    level:{
        type: Number
    }
});

module.exports = mongoose.model('User', user);