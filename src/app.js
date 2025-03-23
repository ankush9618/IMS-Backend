import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Port 3000")
})


export default app;