const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Le nom d’utilisateur est obligatoire.'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L’email est obligatoire.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Format d’email invalide.']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire.'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères.']
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
