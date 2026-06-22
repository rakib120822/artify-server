import { Router } from "express";
import userController from "./user.controller.js";

const router = Router();
router.post("/", userController.createUser);

router.get("/", userController.getUser);
const userRoutes = router;
export default userRoutes;
