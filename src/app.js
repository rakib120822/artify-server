import express from "express";
import cors from "cors";
import artworkRoutes from "./modules/artwork/artwork.route.js";

const app = express();
//middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Artify Server");
});

app.use("/api/artworks", artworkRoutes);

export default app;
