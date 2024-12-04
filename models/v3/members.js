const { required, date } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const Members = mongoose.model('members', new Schema({
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default:null,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default:null,
        required:false,
    },
    first_name:{
        type:String,
        default:null,
        required:false,
    },
    last_name:{
        type:String,
        default:null,
        required:false,
    },
    email:{
        type:String,
        default:null,
        required:false,
    },
    number:{
        type:String,
        default:null,
        required:false,
    },
    dob:{
        type: Date,
        default:null,
        required:false,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', null,""],
        required: false,
      },
    info:{
        type:String,
        default:null,
        reuired:false
    },
    additional_info: {
        type: [{
            title: { type: String, default: null, required: false },
            description: { type: String, default: null, required: false }
        }],
        default: [],
        required:false
    },
    color_code: {
        type: String,
        required:true
      },
      relation:{
        type: String,
        enum: [
              'Sibling', 'Spouse', 'Co-Parent', 'Child',
              'Grandparent', 'Grandchild', 'Aunt/Uncle', 'Niece/Nephew', 
              'Cousin', 'Step-Parent', 'Step-Sibling', 'In-Law', 'Guardian', 'Foster Parent'
            ],
        required: true
      }
          
}, { timestamps: true }
))


module.exports = { Members }
