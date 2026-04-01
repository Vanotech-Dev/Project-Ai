import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transaction.js";
import reportRoutes from "./routes/report.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

app.use(cors({
    origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins,
    credentials: true, // Necessary for better-auth cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Better Auth handling
app.all("/api/auth/*splat", toNodeHandler(auth));

// Application Routes
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);



// Basic route to test the server
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Finance Tracker Backend is running smoothly!" });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
