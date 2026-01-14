import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import userRoutes from "./routes/auth.routes.js"

dotenv.config({
    path: "./.env"
})
const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running  on ${PORT}`))
    })
    .catch((err) => {
        console.error("MongoDB connection error ",err)
        process.exit(1)
    })

    
    app.use("/api/v1/users",userRoutes)
