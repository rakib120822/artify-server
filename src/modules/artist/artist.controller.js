import artistService from "./artist.service.js";

const createArtist = async (req, res) => {
  try {
    const { address, specialization, bio, socialLink, email } = req.body;
    if (!address || !specialization || !socialLink) {
      throw new Error("All Field are required");
    }
    const result = await artistService.createArtistIntoDB({
      address,
      specialization,
      bio,
      socialLink,
      email,
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User Created Successfully",
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

const artistController = { createArtist };
export default artistController;
