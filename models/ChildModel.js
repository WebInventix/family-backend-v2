const mongoose = require('mongoose');
const { Schema } = mongoose;

const childrensSchema = new Schema({
    first_name: {
        type: String,
        default: null,
        required:true
    },
    last_name: {
        type: String,
        default: null,
        required:false
    },
    email: {
        type: String,
        required: true,
        required:false
    },
    number: {
        type: String,
        default: null,
        required:false
    },
    dob: {
        type: Date,
        default: null,
        required:false
    },
    children_info: {
        type: String,
        default: null,
        required:false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', null,""],
        default: null,
        required:false
    },
    family_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'family', // Ensure this references the correct model (probably 'Family' if it stores family info)
        default: null,
        required:false
    },
    additional_info:{
        type: [{
            title: { type: String, default: null },
            description: { type: String, default: null }
        }],
        default: [],
        required:true
    }
}, { timestamps: true });

const Childrens = mongoose.model('Childrens', childrensSchema); // Capitalized model name

module.exports = { Childrens };
