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

const getArtworkByIdFromDb = async (id) => {
  const result = await Artwork.findById(id);
  if (!result) {
    throw new Error("Not Found!");
  }

  return result;
};

const getMyArtworkFromDb = async () => {
  // const result = await artworkCollection
  //   .find({ artist_email: email })
  //   .toArray();
  // const favorites = await favoriteCollection.countDocuments({
  //   userEmail: email,
  // });

  const artworks = await Artwork.find({ email });
  if (!artworks) {
    throw new Error("Not Found!");
  }
  const pending = artworks.filter((art) => art.visibility === "pending");
  const approved = artworks.filter((art) => art.visibility === "approved");
  const rejected = artworks.filter((art) => art.visibility === "rejected");

  const result = {
    pending,
    approved,
    rejected,
  };
  return result;
};

const artworkService = {
  createArtWorkIntoDb,
  getAllArtworkFromDb,
  getLatestArtworkFromDb,
  getArtworkByIdFromDb,
};

export default artworkService;
