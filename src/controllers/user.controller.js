import { asynHandler } from "../utils/asyncHandler.js";



const userRegister = asynHandler((req, res) => {
    //const { name, email, phoneNumber, bio, password, } = req.body;
    res.send("user Register")
})


export {
    userRegister
}