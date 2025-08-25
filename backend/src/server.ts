import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/rootRouter.ts";
<<<<<<< Updated upstream

=======
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRouter.ts";
>>>>>>> Stashed changes

dotenv.config();
const PORT = process.env.PORT;
const app = express();
<<<<<<< Updated upstream



=======
app.use(express.json());
>>>>>>> Stashed changes
app.use("/", rootRouter);
app.use('/api/admin', adminRoutes);

<<<<<<< Updated upstream
app.listen(PORT, () => {
	console.log("Server is running on http://localhost:3000");
});
=======

mongoose.connect(MONGO_URI)
	.then(() => {
		console.log("✅ MongoDB connected");
		app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
	})
	.catch(err => console.error("❌ DB connection error:", err));
>>>>>>> Stashed changes
