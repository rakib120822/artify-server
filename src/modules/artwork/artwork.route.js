import artWorkController from "./artwork.controller.js";
import { Router } from "express";

const router = Router();

router.get("/", artWorkController.getAllArtwork);
router.get("/latest", artWorkController.getLatestArtwork);
router.get("/:id", artWorkController.getArtworkById);

router.post("/", artWorkController.createArtWork);

const artworkRoutes = router;

export default artworkRoutes;
