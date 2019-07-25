const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let mail = new Schema({
    address: {
        type: String
    }
});

module.exports = mongoose.model('Mail', mail);