import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connection to DB successfull, Host Name: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Connection to DB failed,", error);
        process.exit(1);
    }
}

export default connectDB