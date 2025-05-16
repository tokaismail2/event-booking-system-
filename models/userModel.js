const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    emailAddress: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
  },
  password: { type: String, required: true },
  passwordResetCode: { type: String, default: null },
  resetCodeExpire: { type: Date, default: null },
  passwordIsVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;