import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/rootRouter.ts";


dotenv.config();
const PORT = process.env.PORT;
const app = express();



app.use("/", rootRouter);

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:3000");
});
