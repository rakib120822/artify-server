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
      unique: true,
    },
    specialization: {
      type: String,
      enum: ["PAINTER", "SCULPTOR", "PHOTOGRAPHER", "DIGITAL ARTIST", "OTHER"],
      required: true,
    },
    bio: {
      type: String,
      default: "Write Something in Bio",
    },
    socialLink: {
      type: String,
      required: true,
    },
    followers: {
      type: Number,
      default: 0,
    },

    adminApproval: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

const Artist = new mongoose.model("Artist", artistSchema);
export default Artist;
