import express from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/rootRouter";


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();



app.use("/", rootRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
