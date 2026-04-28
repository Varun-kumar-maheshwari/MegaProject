import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import userRoutes from "./routes/auth.routes.js"
import projectRoutes from "./routes/project.routes.js"
import {errorHandler} from "./middlewares/error.middleware.js";

dotenv.config({
    path: "./.env"
})
const PORT = process.env.PORT || 8000;
        app.use(errorHandler);

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running  on ${PORT}`))
    })
    .catch((err) => {
        console.error("MongoDB connection error ",err)
        process.exit(1)
    })
        app.use("/api/v1/users",userRoutes)
        app.use("/api/v1/projects",projectRoutes)


