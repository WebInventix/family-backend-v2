const mongoose = require("mongoose");

const { Schema } = mongoose;
const RelativeBridge = mongoose.model(
  "bridgeRelatives",
  new Schema(
    {
      r_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref:"relatives",
      },

      add_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref:"user",
      }
    },
    { timestamps: true }
  )
);

module.exports = { RelativeBridge };
