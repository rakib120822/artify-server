import { Router } from "express";
import artistController from "./artist.controller.js";

const router = Router();
router.post("/", artistController.createArtist);
const artistRoutes = router;
export default artistRoutes;
