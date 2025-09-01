import { User } from "../models/user.model.js";
import { registerUser, loginUser , logoutUser} from "../controllers/user.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(upload.none(),registerUser)
router.route("/login").post(upload.none(),loginUser)
router.route("/logout").post(verifyJWT, logoutUser)


export default router