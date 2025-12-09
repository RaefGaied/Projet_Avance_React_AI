import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const {
    isAuthenticated,
    user,
    isEnrolledInCourse,
    addEnrolledCourse
  } = useAuth();
  const navigate = useNavigate();

  const enrolled = isEnrolledInCourse(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`).catch((error) => {
          console.error("Erreur:", error);
          return { data: null };
        });

        setCourse(courseRes.data);

        const reviewsRes = await api.get(`/reviews/${id}/reviews`);
        setReviews(reviewsRes.data || []);

      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    if (!user || !user._id) {
      alert("Erreur: Impossible de récupérer votre ID");
      return;
    }

    try {
      const response = await api.post(`/courses/${id}/enroll`, {
        userId: user._id
      });

      if (course) {
        addEnrolledCourse(course);
      } else {
        addEnrolledCourse(id);
      }

      alert("Inscription réussie !");
      const updatedCourse = await api.get(`/courses/${id}`);
      setCourse(updatedCourse.data);

    } catch (err) {
      console.error("Erreur d'inscription:", err);
      alert(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !isAuthenticated || !user?._id) return;

    setSubmitting(true);
    try {
      const response = await api.post(`/reviews/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewText,
        userId: user._id
      });

      setReviews([response.data, ...reviews]);
      setReviewText("");
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (err) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '18px', color: '#666' }}>Chargement en cours...</div>;
  }

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2>Cours non trouvé</h2>
        <p>Le cours demandé n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => navigate('/courses')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '28px', color: '#2c3e50', marginBottom: '15px' }}>{course.title}</h1>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>{course.description}</p>
        <p>Créé par: {typeof course.instructor === 'string' ? course.instructor : (course.instructor?.name || 'Instructeur inconnu')}</p>
      </div>

      {enrolled ? (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '10px 15px',
          borderRadius: '5px',
          margin: '15px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✓</span>
          <span>Vous êtes inscrit à ce cours</span>
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '300px',
            padding: '12px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            margin: '20px 0'
          }}
          onMouseEnter={(e) => !enrolled && (e.target.style.backgroundColor = '#219653')}
          onMouseLeave={(e) => !enrolled && (e.target.style.backgroundColor = '#27ae60')}
        >
          S'inscrire au cours
        </button>
      )}

      <h2 style={{
        fontSize: '24px',
        color: '#2c3e50',
        margin: '30px 0 15px 0',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
      }}>
        Avis des étudiants
      </h2>

      {isAuthenticated && enrolled && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          style={{
            padding: '10px 15px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Laisser un avis
        </button>
      )}

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} style={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Votre avis</h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Note:</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(parseInt(e.target.value))}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '100%',
                maxWidth: '100px'
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} étoile{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Commentaire:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                resize: 'vertical'
              }}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '8px 20px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              {submitting ? 'Envoi...' : 'Envoyer'}
            </button>

            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {reviews.length > 0 ? (
        <div>
          {reviews.map((review) => (
            <div key={review._id} style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#fff'
            }}>
              <div style={{ color: '#f1c40f', fontSize: '20px', marginBottom: '10px' }}>
                {renderStars(review.rating)}
              </div>
              <p style={{ color: '#333', lineHeight: '1.5', marginBottom: '10px' }}>{review.comment}</p>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                Par {review.user?.name || 'Utilisateur anonyme'} • {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
          Aucun avis pour le moment. Soyez le premier à donner votre avis !
        </p>
      )}
    </div>
  );
}

export default CourseDetails;