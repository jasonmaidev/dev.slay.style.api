import express from "express"
import { register, login } from "../controllers/auth.js"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router()

router.post("/register", upload.single("picture"), register)
router.post("/login", login)

export default router