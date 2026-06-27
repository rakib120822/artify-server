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

const getArtist = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await artistService.getArtistFromDB(userId);
    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "User retrieved Successfully",
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

const updateArtist = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const result = await artistService.updateArtistIntoDB(payload, id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Updated Successfully",
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

const deleteArtist = async (req, res) => {
  try {
    const result = await artistService.deleteArtistFromDB(req.params.id);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Deleted Successfully",
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
const updateAdminApproval = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new Error("Invalid Id");
    }
    const result = await artistService.updateAdminApproval(req.params.id);
    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "Updated Successfully",
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

const artistController = {
  createArtist,
  updateArtist,
  deleteArtist,
  getArtist,
  updateAdminApproval,
};
export default artistController;
