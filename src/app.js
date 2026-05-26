import express from "express"
import cors from "cors"
const app = express()
app.use(cors());
import healthCheckRouter from "./routes/healthcheck.routes.js";

import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser())

app.use("/api/v1/healthcheck", healthCheckRouter)

export default app;
