const mongoose = require("mongoose");

const { Schema } = mongoose;
const Invites = mongoose.model(
  "invites",
  new Schema(
    {
        invited_by: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User id is required"],
            ref: "user"
          },
          invited_to: {
            type: mongoose.Schema.Types.ObjectId,
            required: [false, "User id is required"],
            ref: "user"
          },
    },
    { timestamps: true }
  )
);

module.exports = { Invites };
