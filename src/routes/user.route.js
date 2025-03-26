import express from "express";
import { getUserDetails, userDetailsUpdate, userLogin, userLoginStatus, userLogout, userPasswordUpdate, userRegister } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/register").post(userRegister);

router.route("/login").post(userLogin);

router.route("/logout").post(verifyJWT, userLogout);

router.route("/getUser").get(verifyJWT, getUserDetails);

router.route("/login-status").get(userLoginStatus);

router.route("/update-profile").patch(verifyJWT, userDetailsUpdate);

router.route("/change-password").patch(verifyJWT, userPasswordUpdate);


export default router;