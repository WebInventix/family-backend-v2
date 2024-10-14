const mongoose = require("mongoose");

const { Schema } = mongoose;
const Job_Post_Schema = mongoose.model(
  "jobs",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      key_responsiblities: {
        type: String,
        required: false,
      },
      submit_info: {
        type: String,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
    },
    { timestamps: true }
  )
);

module.exports = { Job_Post_Schema };
