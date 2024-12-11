const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const User_Auth_Schema = mongoose.model('user', new Schema({
    first_name: {
        type: String,
        default:null,
        required:false
    },
    last_name: {
        type: String,
        default:null,
        required:false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
       
    },
    number: {
        type: String,
        default:null,
        required:false
    },
    dob: {
        type: Date,
        default:null,
        required:false
    },
    address: {
        type: String,
        default:null,
        required:false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other',null],
        default:null,
    },
    user_role: {
        type: String,
        enum: ['Parent','Lawyer', 'Judge', 'Teacher'],
        require:false
    },

    verified: {
        type: Boolean,
        default:false
        //required:true
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    package: {
        type: String,
        enum: ['Beta','Trail','Promotional Deal','3-Month-Membership','Yearly','Lifetime'],
        require:false,
    },
    profile_status: {
        type: String,
        enum: ['Complete', 'In-Complete'],
        require:true,
        default:"In-Complete"
    },
    public_info:{
        type: String,
        default:false
    },
    user_profile:{
        type: String,
        default:"",
        required:false
    },
    terms_policy: {
        type: String,
        enum: ['No', 'Yes'],
        require:true,
        default:"No"
    },
    color_code:{
        type:String,
        required:false,
    }

          
}, { timestamps: true }
))


module.exports = { User_Auth_Schema }
