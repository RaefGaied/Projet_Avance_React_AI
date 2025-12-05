const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('students', 'username email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('students', 'username email');
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.enrollUser = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Params reçus:', req.params);
    console.log('Body reçu:', req.body);
    console.log('userId reçu:', userId);
    if (!userId) {
      return res.status(400).json({ 
        message: 'userId est requis dans le corps de la requête' 
      });
    }
    const course = await Course.findById(req.params.courseId);
    const user = await User.findById(userId);

    console.log('Course trouvée:', course ? 'Oui' : 'Non');
    console.log('User trouvé:', user ? 'Oui' : 'Non');

    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifie si l'utilisateur est déjà inscrit
    if (course.students.includes(userId)) {
      return res.status(400).json({ 
        message: 'Vous êtes déjà inscrit à ce cours' 
      });
    }

    course.students.push(userId);
    await course.save();
    if (user.courses && !user.courses.includes(course._id)) {
      user.courses.push(course._id);
      await user.save();
    }

    console.log('Inscription réussie pour:', userId);
    
    res.json({ 
      message: 'Inscription réussie',
      course: await Course.findById(course._id).populate('students', 'username email')
    });
    
  } catch (error) {
    console.error('Erreur détaillée lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('students', 'username email');
    
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });
    res.json(course.students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};