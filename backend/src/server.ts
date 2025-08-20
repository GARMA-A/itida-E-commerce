import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/rootRouter.ts";
import mongoose from "mongoose";


dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use("/", rootRouter);


mongoose.connect(process.env.MONGO_URI as string)
	.then(() => {
		console.log("✅ MongoDB connected");
		app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
	})
	.catch(err => console.error("❌ DB connection error:", err));
