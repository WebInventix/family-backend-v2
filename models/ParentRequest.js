const { ref } = require("joi");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const ParentRequest = mongoose.model(
  "parent_request",
  new Schema(
    {   
      parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "User id is required"],
        ref: "user"
      },
      co_parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [false, "User id is required"],
        ref: "user"
      },
      status: {
        type: String,
        enum: ["Pending","Accepted","Rejected"],
        default:"Pending",
        required: [true, "status is required"],
      },
    },
    { timestamps: true }
  )
);

module.exports = { ParentRequest };
