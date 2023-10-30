import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 6,
    },
    phoneNumber: {
      type: String,
      max:20,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    emailConfirm: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "normalUser"
    },
    status: {
      type: Boolean,
      default: true
    },
    availableBalance:{
      type: Number,
      default: 0
    },
    balance:{
      type: Number,
      default: 0
    },
    createdBy:{
      type: String,
    },
  },
  { timestamps: true }
);

var User = mongoose.model("User", UserSchema);
export default User;
