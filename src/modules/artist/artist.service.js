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

const artistService = { createArtistIntoDB };
export default artistService;
