const mongoose = require('mongoose');

const { Schema } = mongoose;
const User_Auth_Schema = mongoose.model('user', new Schema({
    first_name: {
        type: String,
        default:null,
    },
    last_name: {
        type: String,
        default:null,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
       
    },
    number: {
        type: String,
        default:null,
    },
    dob: {
        type: Date,
        default:null,
    },
    address: {
        type: String,
        default:null,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other',null],
        default:null,
    },
    user_role: {
        type: String,
        enum: ['Parent','Lawyer', 'Judge', 'Teacher'],
        require:true
    },

    verified: {
        type: Boolean,
        default:false
        //required:true
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
        type: Boolean,
        default:false
    },
    user_profile:{
        type: String,
        default:"",
        required:false
    }

          
}, { timestamps: true }
))


module.exports = { User_Auth_Schema }
