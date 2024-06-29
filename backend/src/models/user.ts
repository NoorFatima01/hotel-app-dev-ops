// @ts-nocheck

import mongoose from "mongoose";

export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

// Function to be executed before saving the user to the database
// This is actually a middleware
// userSchema.pre(
//   "save",
//   async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
//     if (this.isModified("password")) {
//       this.password = await argon2.hash(this.password);
//     }
//     next();
//   }
// );

const User = mongoose.model<UserType>("User", userSchema);

export default User;
