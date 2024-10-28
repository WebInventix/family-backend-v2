const { ref } = require("joi");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const Parenting = mongoose.model(
  "parenting",
  new Schema(
    {   
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref: "user"
      },
      guardian: {
        type: mongoose.Schema.Types.ObjectId,
        required: [false, "User id is required"],
        ref: "user"
      },
      family_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Family id is required"],
        ref: "family"
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
      isMeeting: {
        type: String,
        enum: ["ALLDAY","REPEATING"],
        required: [true, "Meeting type is required"],
      },
      place: {
        type: String,
        required: [true, "Place is required"],
      },
      notes: {
        type: String,
      },
      attachment: {
        type: String,
      },
      color:{
        type:String,
      },
      status: {
        type: String,
        enum: ["Pending","Accepted","Rejected"],
        default:"Pending",
        required: [true, "Meeting type is required"],
      },
    },
    { timestamps: true }
  )
);

module.exports = { Parenting };
