import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"
import morgan from "morgan"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import apparelRoutes from "./routes/apparels.js"
import styleRoutes from "./routes/styles.js"
import { rateLimit } from 'express-rate-limit'

dotenv.config()

/* Default Config */
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // minute
  limit: 200, // Limit each IP to 100 requests per `window` (here, per 1 minute)
  standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to API calls only
app.use(apiLimiter)

/* Routes */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/apparels", apparelRoutes);
app.use("/styles", styleRoutes);

/* Mongoose Setup */
const PORT = process.env.PORT || 6001;
// mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} failed to connect.`));