import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import crypto from "crypto";
const UserSchema = new Schema({
  firstName: {
    type: String,

  },
  lastName: {
    type: String,

  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

});

// Pre-save middleware to hash passwords
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

// Method to generate JWT token
UserSchema.methods.getJWTToken = function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};



export default model("User", UserSchema);