import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;
connectDB()
    .then(() => {
        app.on("Error", (err) => {
            console.log("Connection to Server Failed");
        })
        app.listen(PORT, () => {
            console.log(`Server is Listening on port ${PORT}`);
        })
    })
    .catch((err) => {
        console.log("Connection to DB Failed");
    })