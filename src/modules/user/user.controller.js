import userService from "./user.service.js";

const createUser = async (req, res) => {
  try {
    const { name, email, image } = req.body;
    const payload = { name, email, image };
    const result = await userService.createUserIntoDB(payload);
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

const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      throw new Error("UnAuthorized!");
    }
    const result = await userService.getUserFromDB(email);
    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "User Retrieved Successfully",
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

const updateUser = async (req, res) => {
  try {
    const { email } = req.query;
    const { name, image } = req.body;
    const updateData = { email, name, image };

    const result = await userService.updatedUserIntoDB(updateData);
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

const userController = {
  createUser,
  getUser,
  updateUser,
};

export default userController;
