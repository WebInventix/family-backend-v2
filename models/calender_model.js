const mongoose = require("mongoose");

const { Schema } = mongoose;
const Calendar_Schema = mongoose.model(
  "event",
  new Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref:"User",
      },

      child_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Child id is required"],
        ref:"Childrens",
      },
      family_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Family id is required"],
        ref:"family",
      },
      name: {
        type: String,
        required: [true, "Event name is required"],
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
        enum: ["ALLDAY", "REPEATING"],
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
    },
    { timestamps: true }
  )
);

module.exports = { Calendar_Schema };
