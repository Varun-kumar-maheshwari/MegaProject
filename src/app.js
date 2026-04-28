import express from "express"

const app = express()

import healthCheckRouter from "./routes/healthcheck.routes.js";

import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser())

app.use("/api/v1/healthcheck", healthCheckRouter)

export default app;
