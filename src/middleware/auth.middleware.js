import jwt from "jsonwebtoken";
import { asynHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";


const verifyJWT = asynHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        throw new ApiError(401, "Unauthorized Request");
    }
    const verifiedUser = await jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (!verifiedUser) {
        throw new ApiError(401, "Invalid Access Token")
    }
    req.user = verifiedUser;
    next();
})

export { verifyJWT };