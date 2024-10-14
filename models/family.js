const mongoose = require('mongoose');

const { Schema } = mongoose;
const Family = mongoose.model('family', new Schema({
    name: {
        type: String,
        default:null,
    },
    parent_1:{
        type: String,
        default:null,
        ref: 'user'
    },
    parent_2:{
        type: String,
        default:null,
        ref: 'user'
    }
          
}, { timestamps: true }
))


module.exports = { Family }
