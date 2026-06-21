import artworkService from "./artwork.service.js";

const createArtWork = async (req, res) => {
  try {
    const { title, description, image, artist, price } = req.body;
    if (!title || !description || !image || !artist || !price) {
      throw new Error("All field are required!");
    }
    const artwork = { title, description, image, artist, price };
    const result = await artworkService.createArtWorkIntoDb(artwork);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "artwork created successfully",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: error.message,
      data: error,
    });
  }
};

const getAllArtwork = async (req, res) => {
  try {
    const { limit = 10, page = 0 } = req.query;
    const result = await artworkService.getAllArtworkFromDb(limit, page);
    res.status(200).json({
      success: true,
      message: "Retrieve successfully",
      data: { result: result.result, totalArtworks: result.length },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const getLatestArtwork = async (req, res) => {
  try {
    const result = await artworkService.getLatestArtworkFromDb();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Retrieved Successfully",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const getArtworkById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Invalid Artwork");
    }
    const result = await artworkService.getArtworkByIdFromDb(id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Retrieved Successfully",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const artWorkController = {
  createArtWork,
  getAllArtwork,
  getLatestArtwork,
  getArtworkById,
};

export default artWorkController;
