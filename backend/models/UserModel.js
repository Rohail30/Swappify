const e = require("express");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
         required: true,
      },
      mobile: {
         type: String,
         required: true,
      },
      verified: {
         type: Boolean,
         default: false,
      },
      isAdmin: {
         type: Boolean,
         default: false,
      },
      isBan: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);


const User = mongoose.models.User || mongoose.model("User", UserSchema);
module.exports = User;