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

const userController = {
  createUser,
};

export default userController;
