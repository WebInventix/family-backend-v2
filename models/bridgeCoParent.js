const mongoose = require("mongoose");

const { Schema } = mongoose;
const CPBridge = mongoose.model(
  "bridgeParent",
  new Schema(
    {
      cp_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref:"user",
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

module.exports = { CPBridge };
