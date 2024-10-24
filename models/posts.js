const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',  // Reference to the user who made the comment
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});



const Posts = mongoose.model('posts', new Schema({
    post: {
        type: String,
        default: null,
    },
    posted_by: {
        type: Schema.Types.ObjectId,  // Assuming you're storing user._id
        ref: 'user',
        default: null,
    },
    likes: [{
        type: Schema.Types.ObjectId,  // Array of user IDs
        ref: 'user',
        default: [],
    }],
    comments: [commentSchema],  // Array of comments
}, { timestamps: true }));

module.exports = { Posts };