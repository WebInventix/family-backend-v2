const { required, date } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const Families = mongoose.model('families', new Schema({
    family_name: {
        type: String,
        required: true,
        trim: true,
      },
      color_code:{
        type:String,
        required:true,
      },
      created_by:{
        type: Schema.Types.ObjectId,
          ref: 'user',
          required: true,
      },
      co_parents: [
        {
          type: Schema.Types.ObjectId,
          ref: 'members',
          
        },
      ],
      children: [
        {
          type: Schema.Types.ObjectId,
          ref: 'members',
        },
      ],
      relatives: [
        {
          type: Schema.Types.ObjectId,
          ref: 'members',
        }
    ]  
          
}, { timestamps: true }
))


module.exports = { Families }
