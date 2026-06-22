import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    adminApproval: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    category: {
      type: String,
      enum: ["painting", "sculpture", "photography", "digital art", "other"],
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Artwork = mongoose.model("Artwork", artworkSchema);

export default Artwork;
