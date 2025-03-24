import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        trim: true,
        toLowerCase: true,
        unique: [true, "Email already Exists"],
        // match: [
        //     /^ [a - zA - Z0 -9._ % +-] + @[a - zA - Z0 - 9. -] +\.[a - zA - Z]{ 2, }$ /,
        //     "Enter Email in valid format"
        // ]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        trim: true,
        // match: [
        //     /^.* (?=.{ 8,50 })(?=.* [a - zA - Z])(?=.*\d)(?=.* [!#$ %&? "]).*$/,
        //     "Password must be minimum of 8char in a Valid Format"
        // ]
    },
    profileImage: {
        type: String,
        default: "https://res.cloudinary.com/daootd1uo/image/upload/v1742757690/qi1onwszqlq6cxtcpm5b.png"
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone Number is Required"]
    },
    bio: {
        type: String,
        maxLength: [250, "Bio must not Exceed 250 Charecters."],
        default: "Bio"
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        email: this.email
    },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("user", userSchema);

