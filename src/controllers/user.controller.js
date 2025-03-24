import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const userRegister = asynHandler(async (req, res) => {
    const { name, email, phoneNumber, password, } = req.body;
    console.log(req.body);
    if ([name, email, phoneNumber, password].some((item) => item === "")) {
        throw new ApiError(400, "All The Fields are Required to Proceed..");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "Email Already Exists");
    }
    const registeredUser = await User.create({
        name,
        email,
        phoneNumber,
        password
    });

    const user = await User.findOne({ email }).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(501, "Error Regitering User to Database")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "User Registered Successfully!", user)
        )


})


export {
    userRegister
}