import User from "../../model/user.model.js";
const createUserIntoDB = async (payload) => {
  const { name, email, image } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const result = await User.create(payload);
  if (!result) {
    throw new Error("User Create failed!");
  }

  return result;
};

const userService = {
  createUserIntoDB,
};

export default userService;
