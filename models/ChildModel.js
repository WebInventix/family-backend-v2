const mongoose = require('mongoose');
const { Schema } = mongoose;

const childrensSchema = new Schema({
    first_name: {
        type: String,
        default: null,
    },
    last_name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        default: null,
    },
    dob: {
        type: Date,
        default: null,
    },
    children_info: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', null],
        default: null,
    },
    family_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure this references the correct model (probably 'Family' if it stores family info)
        default: null,
    },
}, { timestamps: true });

const Childrens = mongoose.model('Childrens', childrensSchema); // Capitalized model name

module.exports = { Childrens };
