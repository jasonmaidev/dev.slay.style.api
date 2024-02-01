import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { uploadFile } from "../aws/s3.js"
import { v4 as uuidv4 } from "uuid"
import sharp from "sharp"

/* Register User */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      guestUser,
      friendUser
    } = req.body

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    const file = req.file
    const imageName = uuidv4()

    const fileBuffer = await sharp(file.buffer)
      .resize({ height: 300, width: 300, quality: 100 })
      .toBuffer()

    await uploadFile(fileBuffer, imageName, file.mimetype)

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath: imageName,
      guestUser,
      friendUser
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(500).json({ Attention: error.message })
  }
}

/* Login User */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ Message: "User does not exist." })
    }

    // if "user" exists
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ Message: "Invalid credentials." })
    }
    // Set token to expire in 12 hours
    const token = jwt.sign({ exp: Math.floor(Date.now()) + 43200000, id: user._id }, process.env.JWT_SECRET)
    delete user.password
    res.status(200).json({ token, user })
  } catch (error) {
    res.status(500).json({ Attention: error.message })
  }
}
