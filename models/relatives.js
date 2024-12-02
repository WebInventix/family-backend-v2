const { ref } = require("joi");
const mongoose = require("mongoose");

const { Schema } = mongoose;
const relatives = mongoose.model(
  "relatives",
  new Schema(
    {   
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        require:false,
        ref: "user"
      },
      last: {
        type: mongoose.Schema.Types.ObjectId,
        required: [false, "User id is required"],
        ref: "user"
      },
      first_name:{
        type: String,
      },
      last_name:{
        type: String,
      },
      email:{
        type: String,
      },
      relation:{
        type: String,
        enum: [
            'Sibling', 'Spouse', 'Co-Parent',
            'Grandparent', 'Grandchild', 'Aunt/Uncle', 'Niece/Nephew', 
            'Cousin', 'Step-Parent', 'Step-Sibling', 'In-Law', 'Guardian', 'Foster Parent'
        ],
        required: true
      }
    },
    { timestamps: true }
  )
);

module.exports = { relatives };
