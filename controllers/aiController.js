const { getModel } = require('../config/gemini');
const Course = require('../models/Course');
const Review = require('../models/Review');

exports.analyzeReviews = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Récupérer le cours et ses reviews
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        // Récupérer toutes les reviews du cours
        const reviews = await Review.find({ course: courseId })
            .populate('user', 'username');

        if (reviews.length === 0) {
            return res.status(400).json({
                message: 'Aucune review disponible pour ce cours'
            });
        }

        // Préparer les données pour Gemini
        const reviewsText = reviews.map((review, index) =>
            `Review ${index + 1} (${review.rating}/5):\n"${review.comment}"`
        ).join('\n\n');

        // Créer le prompt
        const prompt = `Tu es un expert en analyse de feedback éducatif.

Analyse ces ${reviews.length} reviews du cours "${course.title}" :

${reviewsText}

Génère un rapport structuré au format suivant :

## Sentiment Général
[Positif/Neutre/Négatif avec justification]

## Note Moyenne Calculée
[La note moyenne est ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}/5]

## Points Forts (Top 3)
1. [Point fort 1]
2. [Point fort 2]
3. [Point fort 3]

## Points d'Amélioration (Top 3)
1. [Amélioration 1]
2. [Amélioration 2]
3. [Amélioration 3]

## Recommandations pour l'Instructeur
[2-3 recommandations concrètes]

## Résumé en une phrase
[Une phrase résumant l'opinion générale]`;

        // Appel à Gemini
        const model = getModel();
        const result = await model.generateContent(prompt);
        const analysis = result.response.text();

        res.json({
            success: true,
            data: {
                courseTitle: course.title,
                reviewCount: reviews.length,
                analysis: analysis
            }
        });

    } catch (error) {
        console.error('Erreur analyse IA :', error);
        res.status(500).json({
            message: 'Erreur lors de l\'analyse',
            error: error.message
        });
    }
};

exports.generateCourseDescription = async (req, res) => {
    try {
        const { title, instructor, keywords } = req.body;

        if (!title || !instructor) {
            return res.status(400).json({
                message: 'Le titre et l\'instructeur sont requis'
            });
        }

        const keywordsText = keywords ? keywords.join(', ') : '';

        const prompt = `Génère une description professionnelle et attrayante pour un cours en ligne.

Titre: ${title}
Instructeur: ${instructor}
Mots-clés: ${keywordsText}

La description doit :
- Être engageante et motivante (2-3 paragraphes)
- Mentionner les bénéfices pour l'étudiant
- Inclure ce qu'ils vont apprendre
- Se terminer par un appel à l'action

Retourne uniquement la description sans titre.`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const description = result.response.text();

        res.json({
            success: true,
            data: { description }
        });

    } catch (error) {
        console.error('Erreur génération description :', error);
        res.status(500).json({
            message: 'Erreur lors de la génération de la description',
            error: error.message
        });
    }
};


exports.suggestSimilarCourses = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Récupérer le cours de référence
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        // Récupérer tous les autres cours
        const allCourses = await Course.find({
            _id: { $ne: courseId }
        }).select('title description instructor');

        if (allCourses.length === 0) {
            return res.json({
                success: true,
                data: { suggestions: [] }
            });
        }

        // Préparer les données
        const coursesText = allCourses.map((c, i) =>
            `${i + 1}. "${c.title}" par ${c.instructor}\nDescription : ${c.description.substring(0, 100)}...`
        ).join('\n\n');

        const prompt = `Cours de référence :
Titre : ${course.title}
Description : ${course.description}

Liste des autres cours disponibles :
${coursesText}

Analyse le contenu et recommande les 3 cours les plus similaires.
Pour chaque cours, explique brièvement pourquoi il est similaire (2-3 phrases).

Format de réponse :
1. [Numéro du cours] - [Raison de la similarité]
2. [Numéro du cours] - [Raison de la similarité]
3. [Numéro du cours] - [Raison de la similarité]`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const suggestions = result.response.text();

        res.json({
            success: true,
            data: {
                referenceCourse: course.title,
                suggestions: suggestions,
                availableCourses: allCourses.map(c => ({
                    id: c._id,
                    title: c.title
                }))
            }
        });

    } catch (error) {
        console.error('Erreur suggestion cours similaires :', error);
        res.status(500).json({
            message: 'Erreur lors de la recherche de cours similaires',
            error: error.message
        });
    }
};

exports.generateBio = async (req, res) => {
    try {
        const { interests, experience, goals } = req.body;

        if (!interests || !experience) {
            return res.status(400).json({
                message: 'Les centres d\'intérêt et l\'expérience sont requis'
            });
        }

        const prompt = `Génère une biographie professionnelle concise et engageante (3-4 phrases maximum).

Centres d'intérêt : ${interests}
Expérience : ${experience}
Objectifs : ${goals || 'Non spécifiés'}

La biographie doit être écrite à la première personne et donner envie de se connecter avec cette personne.`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const bio = result.response.text();

        res.json({
            success: true,
            data: { bio }
        });

    } catch (error) {
        console.error('Erreur génération biographie :', error);
        res.status(500).json({
            message: 'Erreur lors de la génération de la biographie',
            error: error.message
        });
    }
};


exports.getPlatformInsights = async (req, res) => {
    try {
        // Récupérer tous les cours avec leurs reviews
        const courses = await Course.find().select('title instructor');
        const allReviews = await Review.find().populate('course', 'title');

        // Préparer les statistiques
        const stats = {
            totalCourses: courses.length,
            totalReviews: allReviews.length,
            averageRating: allReviews.length > 0
                ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2)
                : 0
        };

        // Grouper les avis par cours
        const reviewsByCourse = {};
        allReviews.forEach(review => {
            const courseTitle = review.course.title;
            if (!reviewsByCourse[courseTitle]) {
                reviewsByCourse[courseTitle] = [];
            }
            reviewsByCourse[courseTitle].push(review.comment);
        });

        
        const courseSummaries = Object.entries(reviewsByCourse)
            .map(([title, comments]) =>
                `${title} : ${comments.length} avis`
            ).join('\n');

        const prompt = `Tu es un analyste de plateforme éducative.

Voici les statistiques générales :
- ${stats.totalCourses} cours au total
- ${stats.totalReviews} avis au total
- Note moyenne : ${stats.averageRating}/5

Répartition des avis par cours :
${courseSummaries}

Génère un rapport d'analyse avec :

## Santé de la Plateforme
[Évaluation globale]

## Tendances Observées
[2-3 tendances principales]

## Cours Populaires
[Identifier les cours les plus actifs]

## Recommandations Stratégiques
[3 recommandations pour améliorer la plateforme]`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const insights = result.response.text();

        res.json({
            success: true,
            data: {
                stats,
                insights
            }
        });

    } catch (error) {
        console.error('Erreur analyse plateforme :', error);
        res.status(500).json({
            message: 'Erreur lors de l\'analyse de la plateforme',
            error: error.message
        });
    }
};
