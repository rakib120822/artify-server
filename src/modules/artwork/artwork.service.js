import { Aggregate } from "mongoose";
import Artwork from "../../model/artwork.model.js";

const createArtWorkIntoDb = async (payload) => {
  const { title, description, image, artist, price } = payload;
  const result = await Artwork.create({
    title,
    description,
    image,
    artist,
    price,
  });
  if (!result) {
    throw new Error("Artwork is not created!");
  }
  return result;
};

const getAllArtworkFromDb = async (limit, page) => {
  const length = await Artwork.countDocuments();
  const result = await Artwork.find({ adminApproval: "pending" })
    .skip(page * limit)
    .limit(limit);
  if (!result) {
    throw new Error("Not Found");
  }

  return { result, length };
};

const getLatestArtworkFromDb = async () => {
  const result = await Artwork.find().sort({ created_at: -1 }).limit(6);
  if (!result) {
    throw new Error("Not Found");
  }
  return result;
};

const artworkService = {
  createArtWorkIntoDb,
  getAllArtworkFromDb,
  getLatestArtworkFromDb,
};

export default artworkService;
