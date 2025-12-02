const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du cours est obligatoire.'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire.']
  },
  instructor: {
    type: String,
    required: [true, 'Le nom de l’instructeur est obligatoire.']
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Course', courseSchema);
