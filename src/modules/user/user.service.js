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

const getUserFromDB = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found!");
  }
  return user;
};

const updatedUserIntoDB = async (payload) => {
  const { email, name, image } = payload;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("User Not Found");
  }
  const update = await User.findOneAndUpdate({ email }, { email, name, image });
  if (!update) {
    throw new Error("Update Failed");
  }

  const newUser = await User.findOne({ email });
  return newUser;
};

const userService = {
  createUserIntoDB,
  getUserFromDB,
  updatedUserIntoDB,
};

export default userService;
