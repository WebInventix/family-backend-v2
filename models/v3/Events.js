const mongoose = require("mongoose");

const { Schema } = mongoose;
const Events = mongoose.model(
  "events",
  new Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref: "user",
      },
      family_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Family id is required"],
        ref: "families",
      },
      children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "Child id is required"],
          ref: "members",
        },
      ],
      relative: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "members",
        },
      ],
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

module.exports = { Events };
