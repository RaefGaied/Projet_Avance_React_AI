// Importation des modules
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const profileRoutes = require("./routes/profileRoutes")
const courseRoutes = require("./routes/courseRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const authRoutes = require("./routes/authRoutes")



const app = express()

// Parse JSON bodies
app.use(express.json())

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}))

// CONNECTION BDD
connectDB()

// ROUTES API
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/profiles", profileRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/reviews", reviewRoutes)


app.get("/", (req, res) => {
  res.send("Bienvenue sur la plateforme ")
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`))
