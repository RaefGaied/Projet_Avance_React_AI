const Review = require('../models/Review');
const Course = require('../models/Course');

// 1. Ajouter un avis à un cours
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }
    const existingReview = await Review.findOne({
      user: userId,
      course: courseId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Vous avez déjà laissé un avis pour ce cours' 
      });
    }
    const review = await Review.create({
      rating,
      comment,
      course: courseId,
      user: userId
    });
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username email')
      .populate('course', 'title instructor');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Erreur création review:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};
exports.getCourseReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ course: req.params.courseId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 }); // Trier du plus récent au plus ancien
    
    res.json(reviews);
  } catch (error) {
    console.error('Erreur récupération reviews cours:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Récupère tous les avis de l'utilisateur
    const reviews = await Review.find({ user: userId })
      .populate('course', 'title instructor') 
      .populate('user', 'username email')    
      .sort({ createdAt: -1 });              
    
    console.log(` Récupéré ${reviews.length} avis pour l'utilisateur ${userId}`);
    res.json(reviews);
  } catch (error) {
    console.error(' Erreur récupération reviews utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération de vos avis', 
      error: error.message 
    });
  }
};

// 4. SUPPRIMER UN AVIS
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { userId } = req.body;

    // Récupère l'avis
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    // Vérifie que l'utilisateur est propriétaire de l'avis
    if (review.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à supprimer cet avis' 
      });
    }

    // Supprime l'avis
    await review.deleteOne();
    
    console.log(`Avis ${reviewId} supprimé par l'utilisateur ${userId}`);
    res.json({ 
      message: 'Avis supprimé avec succès',
      reviewId: reviewId
    });
  } catch (error) {
    console.error('Erreur suppression review:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la suppression de l\'avis', 
      error: error.message 
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment, userId } = req.body;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à modifier cet avis' 
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    

    await review.save();
    
    const updatedReview = await Review.findById(review._id)
      .populate('user', 'username email')
      .populate('course', 'title instructor');

    console.log(` Avis ${reviewId} mis à jour par l'utilisateur ${userId}`);
    res.json(updatedReview);
  } catch (error) {
    console.error('Erreur mise à jour review:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la modification de l\'avis', 
      error: error.message 
    });
  }
};