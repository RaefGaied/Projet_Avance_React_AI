const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// ➤ Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const { username, email } = req.body

    const user = await User.create({ username, email })
    res.status(201).json({
      message: "Utilisateur créé avec succès ✅",
      user,
    })
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création", error: error.message })
  }
}

// ➤ Afficher tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("courses", "title")
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
}

// ➤ Afficher un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("courses", "title")
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" })
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message })
  }
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" })
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer le nouvel utilisateur
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    })

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(201).json({
      message: "Enregistrement réussi ✅",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'enregistrement", error: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" })
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.status(200).json({
      message: "Connexion réussie ✅",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, bio, website } = req.body;

    // Vérifier que l'utilisateur met à jour son propre profil ou est un administrateur
    if (req.userId !== id && req.userRole !== 'admin') {
      return res.status(403).json({ message: "Non autorisé à mettre à jour ce profil" });
    }

    // Préparer les champs à mettre à jour
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;
    if (website !== undefined) updateFields.website = website;

    const user = await User.findByIdAndUpdate(
      id,
      updateFields,
      {
        new: true,
        runValidators: true,
        select: '-password' // Ne pas renvoyer le mot de passe
      }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès ✅",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        website: user.website,
        courses: user.courses
      },
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);

    // Gestion des erreurs de validation
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        message: "Erreur de validation",
        errors: messages
      });
    }

    // Gestion des erreurs de doublon d'email
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé par un autre compte"
      });
    }

    res.status(500).json({
      message: "Erreur lors de la mise à jour du profil",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.status(200).json({
      message: "Utilisateur supprimé avec succès ✅",
      user,
    })
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message })
  }
}
