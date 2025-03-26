import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { COOKIES_OPTIONS } from "../constants.js";
import jwt from "jsonwebtoken";

const generateAccessRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(400, "Unauthorized user")
        }
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Error Generating Access and Refresh Token");
    }

}

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

const userLogin = asynHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some((item) => item.trim() === "")) {
        throw new ApiError(400, "Email and Password is Required to Proceed")
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "User does not Exists")
    }
    const verifyPassword = await user.isPasswordCorrect(password);
    if (!verifyPassword) {
        throw new ApiError(401, "Email or Password is Incorrect")
    }
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);

    const loginUser = await User.findById(user._id).select("-password -refreshToken");
    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIES_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIES_OPTIONS)
        .json(
            new ApiResponse(200,
                "User Login Successful",
                {
                    user: loginUser,
                    accessToken,
                    refreshToken
                }
            )
        )
})

const userLogout = asynHandler(async (req, res) => {
    await User.findOneAndUpdate(
        req.user_id,
        {
            refreshToken: undefined
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new ApiResponse(200, "User Logout Successful")
        )

})

const getUserDetails = asynHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "User Not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, "User Details Fetched Successfully", user)
        )
})

const userLoginStatus = asynHandler(async (req, res) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        return res.json(false)
    }
    const loginStatus = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (!loginStatus) {
        return res.json(false)
    }
    return res.json(true)
})

const userDetailsUpdate = asynHandler(async (req, res) => {
    const { name, bio } = req.body;
    if (!name || !bio) {
        throw new ApiError(401, "All the fields are required to proceed");
    }
    if (name === req.user.name && bio === req.body.bio) {
        throw new ApiError(401, "Change the Details to update")
    }
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            name,
            bio
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(501, "Error Updating Details");
    }
    console.log("cookie", req.cookies.accessToken)
    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id)
    console.log("cookie", req.cookies.accessToken)
    return res
        .status(200)
        .cookie("accessToken", accessToken, COOKIES_OPTIONS)
        .cookie("refreshToken", refreshToken, COOKIES_OPTIONS)
        .json(
            new ApiResponse(200,
                {
                    user
                }
            )
        )
})

const userPasswordUpdate = asynHandler(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if ([confirmPassword, newPassword, confirmPassword].some((item) => item === "")) {
        throw new ApiError(401, "All the fields are required");
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(401, "User does not Exists");
    }
    const verifyPassword = await user.isPasswordCorrect(currentPassword);
    if (!verifyPassword) {
        throw new ApiError(401, "Current Password is Incorrect");
    }
    if (currentPassword === newPassword) {
        throw new ApiError(401, "Both Password is Same")
    }
    if (newPassword !== confirmPassword) {
        throw new ApiError(401, "New Password does not Match");
    }
    user.password = newPassword;
    user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Password Updated Successfully", user)
        )
})

export {
    userRegister,
    userLogin,
    userLogout,
    getUserDetails,
    userLoginStatus,
    userDetailsUpdate,
    userPasswordUpdate
}