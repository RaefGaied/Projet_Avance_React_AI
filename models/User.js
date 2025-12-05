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
  bio: {
    type: String,
    maxlength: [500, 'La bio ne peut pas dépasser 500 caractères.'],
    default: ''
  },
  website: {
    type: String,
    match: [/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 'Format d\'URL invalide'],
    default: ''
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
