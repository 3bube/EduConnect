import express, { Request, Response } from "express";
import connectDB from "../config/db";
import cors from "cors";
import authRoute from "../routes/auth.route";
import courseRoute from "../routes/course.route";
import assessmentsRoute from "../routes/assessments.route";
import certificateRoute from "../routes/certificates.route";
import studentRoute from "../routes/student.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Default Route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Server!");
});

app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/assessments", assessmentsRoute);
app.use("/api/certificates", certificateRoute);
app.use("/api/student", studentRoute);

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  await connectDB();
});
