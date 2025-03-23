import mongoose from "mongoose";


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
        match: [
            /^ [a - zA - Z0 -9._ % +-] + @[a - zA - Z0 - 9. -] +\.[a - zA - Z]{ 2, }$ /,
            "Enter Email in valid format"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is Required"],
        trim: true,
        match: [
            /^.* (?=.{ 8,50 })(?=.* [a - zA - Z])(?=.*\d)(?=.* [!#$ %&? "]).*$/,
            "Enter Password in a Valid Format"
        ]
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
    }
}, { timestamps: true })

export const User = mongoose.model("user", userSchema);

