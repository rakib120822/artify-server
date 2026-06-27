import User from "../../model/user.model.js";
import Artist from "../../model/artist.model.js";
const createArtistIntoDB = async (payload) => {
  const { address, specialization, socialLink, email } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User Not Found!");
  }
  const artist = await Artist.create({
    address,
    specialization,
    socialLink,
    userId: user.id,
  });

  if (!artist) {
    throw new Error("Created Artist Is Failed");
  }

  return artist;
};

const updateArtistIntoDB = async (payload, id) => {
  const { address, bio, socialLink, specialization, name, image } = payload;
  const artist = await Artist.findByIdAndUpdate(
    id,
    {
      address,
      bio,
      socialLink,
      specialization,
    },
    { new: true },
  );

  if (name || image) {
    await User.findByIdAndUpdate(artist.userId, {
      name,
      image,
    });
  }
  const updatedArtist = await Artist.findById(id).populate("userId");
  if (!updatedArtist) {
    throw new Error("User not updated!");
  }
  return updatedArtist;
};

const updateAdminApproval = async (id, approval) => {
  const artist = await Artist.findByIdAndUpdate(
    { userId: id },
    { adminApproval: approval },
  );
  if (!artist) {
    throw new Error("Artist not found!");
  }
  return artist;
};

const deleteArtistFromDB = async (id) => {
  await Artist.findByIdAndDelete({ userId: id });
  return null;
};

const getArtistFromDB = async (id) => {
  const artist = await Artist.findOne({ userId: id }).populate("userId");
  if (!artist) {
    throw new Error("Artist is not found!");
  }
  return artist;
};

const artistService = {
  createArtistIntoDB,
  updateArtistIntoDB,
  deleteArtistFromDB,
  getArtistFromDB,
  updateAdminApproval,
};
export default artistService;
