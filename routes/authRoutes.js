const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")


router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body

    
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "Email déjà utilisé" })
    }

    
    const hashedPassword = await bcrypt.hash(password, 10)

    
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Trouver l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" })
    }

    
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
