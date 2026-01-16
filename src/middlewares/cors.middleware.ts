import cors from "cors";

export const corsMiddleware = cors({
  origin: "http://localhost:3000", // frontend origin
  credentials: true,               // 🔑 REQUIRED for cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
});