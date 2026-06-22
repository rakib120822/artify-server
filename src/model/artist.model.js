import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      enum: ["PAINTER", "SCULPTOR", "PHOTOGRAPHER", "DIGITAL ARTIST", "OTHER"],
      required: true,
    },
    bio: {
      type: String,
    },
    socialLink: {
      type: String,
    },
    followers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
