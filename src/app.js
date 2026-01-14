import express from "express"

const app = express()

import healthCheckRouter from "./routes/healthcheck.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter)

import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

app.use(errorHandler);
app.use(express.json());
app.use(cookieParser())

export default app;