import {
  errorHandler
} from "./middleware/errorMiddleware.js";
import express from "express";
import cors from "cors";

import applicationRoutes from "./routes/applicationRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "CareerPilot API is running"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use("/api/applications", applicationRoutes);

app.use(
  (
    _req,
    _res,
    next
  ) => {
    const error: any = new Error(
      "Route not found"
    );

    error.statusCode = 404;

    next(error);
  }
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});