const mongoose = require('mongoose');

const { Schema } = mongoose;
const Expenses = mongoose.model('expenses', new Schema({
    amount: {
        type: String,
        default:null,
    },
    date: {
        type: Date,
        default:null,
    },
    reason: {
        type: String,
        default:null,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default:null,
    },
    child_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'childrens',
        default:null,
    },
    family_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'family',
        default:null,

    },
    notes: {
        type: String,
        default:null,
    },
    attachment: {
        type: String,
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


module.exports = { Expenses }
