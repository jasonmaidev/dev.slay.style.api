import express from "express"
import {
  resetWardrobe,
  createApparel,
  getApparels,
  getApparelsCount,
  updateApparel,
  deleteApparel,
  deleteDemoApparel,
  getApparel,
  getShortTops,
  getLongTops,
  getOuterwear,
  getOnePiece,
  getPants,
  getShorts,
  getFootwear,
  getHeadwear
} from "../controllers/apparels.js"
import { verifyToken } from "../middleware/auth.js"
import multer from "multer"
import apicache from 'apicache'
let cache = apicache.middleware

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const router = express.Router()

router.get("/:userId", verifyToken, cache('2 seconds'), getApparels)
router.get("/:userId/count", verifyToken, getApparelsCount)
router.get("/:userId/shorttops", verifyToken, cache('4 seconds'), getShortTops)
router.get("/:userId/longtops", verifyToken, cache('4 seconds'), getLongTops)
router.get("/:userId/outerwear", verifyToken, cache('4 seconds'), getOuterwear)
router.get("/:userId/onepiece", verifyToken, cache('4 seconds'), getOnePiece)
router.get("/:userId/pants", verifyToken, cache('4 seconds'), getPants)
router.get("/:userId/shorts", verifyToken, cache('4 seconds'), getShorts)
router.get("/:userId/footwear", verifyToken, cache('4 seconds'), getFootwear)
router.get("/:userId/headwear", verifyToken, cache('4 seconds'), getHeadwear)
router.get("/:userId/:id", verifyToken, cache('4 seconds'), getApparel)

router.post("/", verifyToken, upload.single("picture"), createApparel)
router.post("/:userId/resetwardrobe", verifyToken, resetWardrobe)
router.patch("/:id/update", verifyToken, updateApparel)
router.delete("/:id/delete", verifyToken, deleteApparel)
router.delete("/:id/deletedemo/:dailyAllowedDeletes", verifyToken, deleteDemoApparel)

export default router