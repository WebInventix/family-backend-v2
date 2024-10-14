const mongoose = require('mongoose');

const { Schema } = mongoose;
const Balance = mongoose.model('balance', new Schema({
    amount: {
        type: String,
        default:null,
    },
    date: {
        type: Date,
        default:null,
    },
  
   
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default:null,
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default:null,
    },
    status: {
        type: String,
        enum: ["Pending","Accepted","Rejected"],
        default:"Pending",
        required: [true, "Meeting type is required"],
      },
          
}, { timestamps: true }
))


module.exports = { Balance }
