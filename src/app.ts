import express from "express";
import cors from "cors";
import profile_router from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server Active!" });
});

app.use("/api", profile_router)


export default app