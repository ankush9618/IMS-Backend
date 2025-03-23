import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import userRoute from "./routes/user.route.js"

const app = express();

//Middelewares

app.use(cors({
    origin: process.env.CORS_ORIGIN //allow to access api routes from authorized url
}))
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))

app.use("/api/v1/users", userRoute);



export default app;