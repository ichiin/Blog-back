const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blog = new Schema({
    post_body: {
        type: String
    },
    post_title: {
        type: String
    },
    post_tags: {
        type: Array
    },
    post_date: {
        type: Date
    },
    post_imgURL: {
        type: String
    },
    post_comments: {
        type: Array
    }
});

module.exports = mongoose.model('Blog', blog);