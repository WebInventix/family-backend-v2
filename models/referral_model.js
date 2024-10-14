const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralSchema = new Schema(
  {
    referrerEmail: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    friendEmail: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    // friendSubscribed: {
    //   type: Boolean,
    //   default: false,
    // },
    // rewardGiven: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  { timestamps: true }
);

const Referral_Schema = mongoose.model("Referral", referralSchema);

module.exports = Referral_Schema;
