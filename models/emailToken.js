const mongoose = require("mongoose");

const { Schema } = mongoose;
const EmailToken = mongoose.model("email_tokens", new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 36000,
        default: Date.now
    },
   

}, { timestamps: true }))


module.exports = { EmailToken }