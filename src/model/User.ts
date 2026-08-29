import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;

  // Optional because Google users don't need a password
  password?: string;

  // Optional because Google users don't need email verification
  verifyCode?: string;
  verifyCodeExpiry?: Date;

  isVerified: boolean;

  // Keeping your existing spelling so we don't break
  // the rest of your currently working application
  isAcceptngMessage: boolean;

  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is Required"],
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please use a valid email address",
    ],
  },

  // Not required for Google users
  password: {
    type: String,
    required: false,
  },

  // Not required for Google users
  verifyCode: {
    type: String,
    required: false,
  },

  // Not required for Google users
  verifyCodeExpiry: {
    type: Date,
    required: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  isAcceptngMessage: {
    type: Boolean,
    default: true,
  },

  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;