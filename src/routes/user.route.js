import express from "express";
import { userLogin, userLogout, userRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(userRegister);

router.route("/login").post(userLogin);

router.route("/logout").post(verifyJWT, userLogout);


export default router;