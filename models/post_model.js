const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let post = new Schema({
    post_title: {
        type: String
    },
    post_tags: {
        type: Array
    },
    post_pitch: {
        type: String
    },
    post_body: {
        type: String
    },
    post_date: {
        type: Date
    },
    post_comments: {
        type: Array
    }
});

module.exports = mongoose.model('Post', post);