import artWorkController from "./artwork.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", artWorkController.getAllArtwork);

router.post("/", artWorkController.createArtWork);

const artworkRoutes = router;

export default artworkRoutes;
