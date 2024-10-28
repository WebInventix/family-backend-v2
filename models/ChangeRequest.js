const { ref } = require("joi");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const ChangeRequest = mongoose.model(
  "ChangeRequest",
  new Schema(
    {   
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref: "user"
      },
      parenting_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [false, "Parenting id is required"],
        ref: "parenting"
      },
      guardian: {
        type: mongoose.Schema.Types.ObjectId,
        required: [false, "User id is required"],
        ref: "user"
      },
      child_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [false, "User id is required"],
        ref: "Childrens"
      },
      startDate: {
        type: Date,
        required: [true, "Start date is required"],
      },
      endDate: {
        type: Date,
        required: [true, "End date is required"],
      },
     
      reason: {
        type: String,
        required: [true, "Place is required"],
      },
     
      status: {
        type: String,
        enum: ["Pending","Accepted","Rejected"],
        default:"Pending",
        required: [true, "Status is required"],
      },
    },
    { timestamps: true }
  )
);

module.exports = { ChangeRequest };
