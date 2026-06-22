import express from "express";
import cors from "cors";
import artworkRoutes from "./modules/artwork/artwork.route.js";
import userRoutes from "./modules/user/user.route.js";
import artistRoutes from "./modules/artist/artist.route.js";

const app = express();
//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Artify Server");
});

app.use("/api/artworks", artworkRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/artist", artistRoutes);

export default app;
