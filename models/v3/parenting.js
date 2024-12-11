const mongoose = require('mongoose');

const { Schema } = mongoose;
const Parentingv3 = mongoose.model('parentingv3', new Schema({
  child_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'members',
    required: true,
  },
  starts_at: {
    type: Date,
    required: true,
  },
  ends_at: {
    type: Date,
    required: true,
  },
  children_spend_the_night_with_the_creator: {
    type: Boolean,
    default: false,
    required: false,
  },
  children_spend_the_weekend_with_the_creator: {
    type: Boolean,
    default: false,
    required: false,
  },
  days: {
    type: Map,
    of: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    default: null,
    required: false,
  },
  exchange_day: {
    type: Number,
    default: null,
    required: false,
  },
  model_id: {
    type: String,
    default: null,
    required: false,
  },
  the_creator_has_the_main_custody: {
    type: Boolean,
    default: false,
    required: false,
  },
  weekend_end_day: {
    type: Number,
    default: null,
    required: false,
  },
  weekend_end_time: {
    type: String,
    default: null,
    required: false,
  },
  weekend_start_day: {
    type: Number,
    default: null,
    required: false,
  },
  weekend_start_time: {
    type: String,
    default: null,
    required: false,
  },
  family_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'families',
  },
  co_parent:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }
}, { timestamps: true }));

module.exports = { Parentingv3 };
