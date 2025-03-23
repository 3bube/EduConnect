import express, { Request, Response } from "express";
import connectDB from "../config/db";
import cors from "cors";
import authRoute from "../routes/auth.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Connect to MongoDB

// Middleware
app.use(express.json());
app.use(cors());

// Default Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Server!");
});

app.use("/api/auth", authRoute);

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await connectDB();
});
