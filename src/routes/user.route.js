import express from "express";
import { userRegister } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(userRegister)



export default router;