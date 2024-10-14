const mongoose = require('mongoose');

const { Schema } = mongoose;
const Company = mongoose.model('company', new Schema({
    name: {
        type: String,
        default:null,
    },
          
}, { timestamps: true }
))


module.exports = { Company }
