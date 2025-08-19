import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "./config/passport";
// import { connectDB } from "./config/database";
import rootRouter from "./routes/rootRouter";
import authRouter from "./routes/authRouter";
import protectedRouter from "./routes/protectedRouter";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Connect to MongoDB - disabled for demo
// connectDB();
console.log('Database connection disabled for demo purposes');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", rootRouter);
app.use("/api/auth", authRouter);
app.use("/api", protectedRouter);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
