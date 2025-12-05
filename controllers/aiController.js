const { getModel } = require('../config/gemini');
const Course = require('../models/Course');
const Review = require('../models/Review');


exports.analyzeReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const reviews = await Review.find({ course: courseId })
            .populate('user', 'username');

        if (reviews.length === 0) {
            return res.status(400).json({
                message: 'No reviews available for this course'
            });
        }

        const reviewsText = reviews.map((review, index) =>
            `Review ${index + 1} (${review.rating}/5):\n"${review.comment}"`
        ).join('\n\n');

        
        const prompt = `You are an expert in educational feedback analysis.

Analyze these ${reviews.length} reviews for the course "${course.title}":

${reviewsText}

Generate a structured report in the following format:

## Overall Sentiment
[Positive/Neutral/Negative with justification]

## Average Rating
[The average rating is ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}/5]

## Strengths (Top 3)
1. [Strength 1]
2. [Strength 2]
3. [Strength 3]

## Areas for Improvement (Top 3)
1. [Improvement 1]
2. [Improvement 2]
3. [Improvement 3]

## Instructor Recommendations
[2-3 concrete recommendations]

## One-Sentence Summary
[A single sentence summarizing the general opinion]`;

        // Call Gemini
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
        console.error('AI Analysis Error:', error);
        res.status(500).json({
            message: 'Error during analysis',
            error: error.message
        });
    }
};


exports.generateCourseDescription = async (req, res) => {
    try {
        const { title, instructor, keywords } = req.body;

        if (!title || !instructor) {
            return res.status(400).json({
                message: 'Title and instructor are required'
            });
        }

        const keywordsText = keywords ? keywords.join(', ') : '';

        const prompt = `Generate an attractive and professional description for an online course.

Title: ${title}
Instructor: ${instructor}
Keywords: ${keywordsText}

The description should:
- Be engaging and motivating (2-3 paragraphs)
- Mention the benefits for the student
- Include what they will learn
- End with a call to action

Return only the description without a title.`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const description = result.response.text();

        res.json({
            success: true,
            data: { description }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.suggestSimilarCourses = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Get reference course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Get all other courses
        const allCourses = await Course.find({
            _id: { $ne: courseId }
        }).select('title description instructor');

        if (allCourses.length === 0) {
            return res.json({
                success: true,
                data: { suggestions: [] }
            });
        }

        // Prepare data
        const coursesText = allCourses.map((c, i) =>
            `${i + 1}. "${c.title}" by ${c.instructor}\nDescription: ${c.description.substring(0, 100)}...`
        ).join('\n\n');

        const prompt = `Reference Course:
Title: ${course.title}
Description: ${course.description}

List of other available courses:
${coursesText}

Analyze the content and recommend the 3 most similar courses.
For each course, briefly explain why it's similar (2-3 sentences).

Response format:
1. [Course Number] - [Similarity Reason]
2. [Course Number] - [Similarity Reason]
3. [Course Number] - [Similarity Reason]`;

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
        res.status(500).json({ message: error.message });
    }
};


exports.generateBio = async (req, res) => {
    try {
        const { interests, experience, goals } = req.body;

        if (!interests || !experience) {
            return res.status(400).json({
                message: 'Interests and experience are required'
            });
        }

        const prompt = `Generate a concise and engaging professional bio (3-4 sentences max).

Interests: ${interests}
Experience: ${experience}
Goals: ${goals || 'Not specified'}

The bio should be written in first person and make people want to connect with this person.`;

        const model = getModel();
        const result = await model.generateContent(prompt);
        const bio = result.response.text();

        res.json({
            success: true,
            data: { bio }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getPlatformInsights = async (req, res) => {
    try {
        // Get all courses with their reviews
        const courses = await Course.find().select('title instructor');
        const allReviews = await Review.find().populate('course', 'title');

        // Prepare statistics
        const stats = {
            totalCourses: courses.length,
            totalReviews: allReviews.length,
            averageRating: allReviews.length > 0
                ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2)
                : 0
        };

        
        const reviewsByCourse = {};
        allReviews.forEach(review => {
            const courseTitle = review.course.title;
            if (!reviewsByCourse[courseTitle]) {
                reviewsByCourse[courseTitle] = [];
            }
            reviewsByCourse[courseTitle].push(review.comment);
        });

        // Create summary for Gemini
        const courseSummaries = Object.entries(reviewsByCourse)
            .map(([title, comments]) =>
                `${title}: ${comments.length} reviews`
            ).join('\n');

        const prompt = `You are an educational platform analyst.

Here are the general statistics:
- ${stats.totalCourses} total courses
- ${stats.totalReviews} total reviews
- Average rating: ${stats.averageRating}/5

Review distribution by course:
${courseSummaries}

Generate an insights report with:

## Platform Health
[Overall assessment]

## Observed Trends
[2-3 main trends]

## Popular Courses
[Identify the most active courses]

## Strategic Recommendations
[3 recommendations to improve the platform]`;

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
        res.status(500).json({ message: error.message });
    }
};
