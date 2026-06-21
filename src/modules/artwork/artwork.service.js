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
  //   const totalArtworks = length[]
  console.log("length : ", length);

  //   const result = await artworkCollection
  //     .find({ adminApproval: "approved" })
  //     .project({
  //       artist_image: 0,
  //       followers: 0,
  //       created_at: 0,
  //       artist_email: 0,
  //       price: 0,
  //       visibility: 0,
  //       description: 0,
  //       medium: 0,
  //     })
  //     .limit(parseInt(limit))
  //     .skip(parseInt(page))
  //     .toArray();

  const result = await Artwork.find({ adminApproval: "pending" })
    .skip(page * limit)
    .limit(limit);
  if (!result) {
    throw new Error("Not Found");
  }

  return { result, length };
};

const artworkService = {
  createArtWorkIntoDb,
  getAllArtworkFromDb,
};

export default artworkService;
