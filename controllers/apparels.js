import Apparel from "../models/Apparel.js"
import Style from "../models/Style.js"
import { uploadFile, deleteFile } from "../aws/s3.js"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"
import mongoose from "mongoose"

// Upload Apparel
export const createApparel = async (req, res) => {
  try {
    const { userId, picturePath, name, section, colors, category, brand, own, description } = req.body
    const file = req.file
    const imageName = uuidv4()

    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 600, width: 600, quality: 100 })
      .webp()
      .toBuffer()

    await uploadFile(fileBuffer, imageName, file.mimetype)

    const newApparel = new Apparel({
      userId,
      picturePath: imageName,
      name,
      section,
      colors,
      category,
      brand,
      own,
      description
    })

    await newApparel.save()
    const apparels = await Apparel.find()
    res.status(201).json(apparels)
  } catch (error) {
    res.status(409).json({ Message: error.message })
  }
}

// Get apparels
export const getApparels = async (req, res) => {
  try {
    const { userId } = req.params
    const apparels = await Apparel.find({ userId })
    res.status(200).json(apparels)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

// Get apparels count
export const getApparelsCount = async (req, res) => {
  try {
    const { userId } = req.params
    const totalApparelsCount = await Apparel.find({ userId }).countDocuments()
    res.status(200).json(totalApparelsCount)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

// Get apparels by section
export const getShortTops = async (req, res) => {
  try {
    const { userId } = req.params
    const shorttops = await Apparel.find({ userId, section: "shorttops" })
    res.status(200).json(shorttops)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getLongTops = async (req, res) => {
  try {
    const { userId } = req.params
    const longtops = await Apparel.find({ userId, section: "longtops" })
    res.status(200).json(longtops)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getOuterwear = async (req, res) => {
  try {
    const { userId } = req.params
    const outerwear = await Apparel.find({ userId, section: "outerwear" })
    res.status(200).json(outerwear)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getOnePiece = async (req, res) => {
  try {
    const { userId } = req.params
    const onepiece = await Apparel.find({ userId, section: "onepiece" })
    res.status(200).json(onepiece)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getPants = async (req, res) => {
  try {
    const { userId } = req.params
    const pants = await Apparel.find({ userId, section: "pants" })
    res.status(200).json(pants)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getShorts = async (req, res) => {
  try {
    const { userId } = req.params
    const shorts = await Apparel.find({ userId, section: "shorts" })
    res.status(200).json(shorts)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getFootwear = async (req, res) => {
  try {
    const { userId } = req.params
    const footwear = await Apparel.find({ userId, section: "footwear" })
    res.status(200).json(footwear)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
export const getHeadwear = async (req, res) => {
  try {
    const { userId } = req.params
    const headwear = await Apparel.find({ userId, section: "headwear" })
    res.status(200).json(headwear)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}
// Get Apparel
export const getApparel = async (req, res) => {
  try {
    const apparel = await Apparel.findById(req.params.id)
    res.status(200).json(apparel)
  } catch (error) {
    res.status(404).json({ Message: error.message })
  }
}

// Update Apparel
export const updateApparel = async (req, res) => {
  const updates = Object.keys(req.body)
  const alllowedUpdates =
    [
      "name",
      // "section", 
      // "picturePath", 
      // "picture"
    ]
  const isValidOperation = updates.every((update) => alllowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid operation" })
  }

  try {
    const { id } = req.params
    const apparel = await Apparel.findById(id)

    if (!apparel) {
      return res.status(404).send()
    }
    if (updates) {
      updates.forEach((update) => apparel[update] = req.body[update])
    }
    await apparel.save()

    res.send(apparel)
  } catch (error) {
    res.status(400).send(error)
  }
}

// Delete Apparel
export const deleteApparel = async (req, res) => {
  try {
    const apparel = await Apparel.find({ _id: req.params.id })
    await deleteFile(apparel[0].picturePath) // Delete image from S3
    await Apparel.findOneAndDelete({ _id: req.params.id })

    if (!apparel) {
      return res.status(404).json({ Message: "Apparel was not found!" })
    }
    res.send(apparel)
  } catch (error) {
    res.status(500).json({ Attention: error.message })
  }
}

// Delete Demo Apparel
export const deleteDemoApparel = async (req, res) => {
  try {
    const allowedDeletes = req.params.dailyAllowedDeletes

    if (allowedDeletes < 1) {
      res.status(429).send("You've reached the daily limit for deletions allowed for guest accounts. Please try again when the refresh timer expires.")
    } else {
      const apparel = await Apparel.findOneAndDelete({ _id: req.params.id })

      if (!apparel) {
        return res.status(404).json({ Message: "Apparel was not found!" })
      }
      res.send(apparel)
    }

  } catch (error) {
    res.status(500).json({ Attention: error.message })
  }
}

// Reset Wardrobe Apparels and Styles
export const resetWardrobe = async (req, res) => {
  try {
    const { userId } = req.params
    await Apparel.deleteMany({ userId })
    await Style.deleteMany({ userId })
    const filetype = ".webp"
    const defaultapparels = [
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `beige blue hat${filetype}`, name: "beige blue hat", section: "headwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `hilfiger hat stripe gray${filetype}`, name: "hilfiger hat stripe gray", section: "headwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `heavy washed tee black${filetype}`, name: "heavy washed tee black", section: "shorttops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `hilfiger striped tee navy${filetype}`, name: "hilfiger striped tee navy", section: "shorttops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `nike tee navy bubblegum${filetype}`, name: "nike tee navy bubblegum", section: "shorttops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `nike tee white bubblegum${filetype}`, name: "nike tee white bubblegum", section: "shorttops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `polkadot polo gray${filetype}`, name: "polkadot polo gray", section: "shorttops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `anchor crew sweatshirt teal${filetype}`, name: "anchor crew sweatshirt teal", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `champs crewneck sweathshirt peach${filetype}`, name: "champs crewneck sweathshirt peach", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `good intentions hoodie lilac${filetype}`, name: "good intentions hoodie lilac", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `jedi crewneck sweatshirt navy${filetype}`, name: "jedi crewneck sweatshirt navy", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `long tee white${filetype}`, name: "long tee white", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `nike crewneck sweatshirt black${filetype}`, name: "nike crewneck sweatshirt black", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `shirt striped red${filetype}`, name: "shirt striped red", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `striped long tee sun${filetype}`, name: "striped long tee sun", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `supreme light crewneck long tee sky blue${filetype}`, name: "supreme light crewneck long tee sky blue", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `thin crewneck sweatshirt gum navy${filetype}`, name: "thin crewneck sweatshirt gum navy", section: "longtops" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `light heather cardigan navy${filetype}`, name: "light heather cardigan navy", section: "outerwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `preppy light cardigan gray${filetype}`, name: "preppy light cardigan gray", section: "outerwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `sherpa jacket light blue${filetype}`, name: "sherpa jacket light blue", section: "outerwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `sherpa jacket plaid black${filetype}`, name: "sherpa jacket plaid black", section: "outerwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `war torn denim jacket${filetype}`, name: "war torn denim jacket", section: "outerwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `jogger pants striped gray${filetype}`, name: "jogger pants striped gray", section: "pants" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `jogger pants striped navy${filetype}`, name: "jogger pants striped navy", section: "pants" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `skinny fit pants blue${filetype}`, name: "skinny fit pants blue", section: "pants" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `skinny fit pants khaki${filetype}`, name: "skinny fit pants khaki", section: "pants" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `vanquish light joggers red${filetype}`, name: "vanquish light joggers red", section: "pants" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `gym shorts maroon${filetype}`, name: "gym shorts maroon", section: "shorts" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `wheel shorts navy${filetype}`, name: "wheel shorts navy", section: "shorts" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `adidas ultraboost 22 white${filetype}`, name: "adidas ultraboost 22 white", section: "footwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `emerica indicator navy${filetype}`, name: "emerica indicator navy", section: "footwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `nautica boat beige${filetype}`, name: "nautica boat beige", section: "footwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `sb bruins olumpic${filetype}`, name: "sb bruins olumpic", section: "footwear" },
      { _id: new mongoose.Types.ObjectId(), userId: userId, picturePath: `vans old skool beige${filetype}`, name: "vans old skool beige", section: "footwear" },
    ]

    await Apparel.insertMany(defaultapparels)
    const apparels = await Apparel.find()
    res.status(201).json(apparels)
  } catch (error) {
    res.status(409).json({ Message: error.message })
  }
}
