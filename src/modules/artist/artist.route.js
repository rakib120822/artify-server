import { Router } from "express";
import artistController from "./artist.controller.js";

const router = Router();
router.post("/", artistController.createArtist);
router.patch("/:id", artistController.updateArtist);
router.patch("/admin-approval/:id", artistController.updateAdminApproval);
router.delete("/:id", artistController.deleteArtist);
router.get("/:userId", artistController.getArtist);
const artistRoutes = router;
export default artistRoutes;
