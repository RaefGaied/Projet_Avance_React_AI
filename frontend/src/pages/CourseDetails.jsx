import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    // Vérification de la longueur du commentaire
    if (reviewText.trim().length < 10) {
      alert("Le commentaire doit contenir au moins 10 caractères");
      return;
    }

    if (!isAuthenticated || !user?._id) {
      alert("Vous devez être connecté pour soumettre un avis");
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        rating: reviewRating,
        comment: reviewText,
        userId: user._id
      };

      console.log("Envoi des données d'avis :", reviewData);

      const response = await api.post(`/reviews/${id}/reviews`, reviewData);

      setReviews([response.data, ...reviews]);
      setReviewText("");
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (err) {
      console.error("Erreur détaillée:", err);
      const errorMessage = err.response?.data?.message ||
        (err.response?.data?.errors ?
          Object.values(err.response.data.errors).map(e => e.message).join('\n') :
          "Erreur lors de l'envoi de l'avis");
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        backgroundColor: '#0f172a',
        color: '#e2e8f0'
      }}>
        <div style={{
          border: '4px solid rgba(255, 255, 255, 0.1)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          borderTopColor: '#60a5fa',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 15px'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        color: '#e2e8f0'
      }}>
        <h2 style={{ color: '#f8fafc' }}>Cours non trouvé</h2>
        <p style={{ color: '#94a3b8' }}>Le cours demandé n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => navigate('/courses')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '15px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      color: '#e2e8f0'
    }}>
      <h1 style={{
        fontSize: '2rem',
        color: '#f8fafc',
        marginBottom: '20px',
        fontWeight: '600'
      }}>{course.title}</h1>

      <div style={{
        backgroundColor: '#1e293b',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '1px solid #2d3748',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <p style={{
          fontSize: '1rem',
          color: '#e2e8f0',
          lineHeight: '1.7',
          marginBottom: '20px'
        }}>{course.description}</p>
        <p style={{
          color: '#94a3b8',
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          Créé par: {typeof course.instructor === 'string' ? course.instructor : (course.instructor?.name || 'Instructeur inconnu')}
        </p>
      </div>

      {enrolled ? (
        <div style={{
          backgroundColor: '#1e3a1e',
          color: '#4ade80',
          padding: '12px 20px',
          borderRadius: '8px',
          margin: '0 0 20px',
          border: '1px solid #2d7d32',
          maxWidth: 'fit-content'
        }}>
          <span style={{ fontSize: '1.2rem' }}>✓</span> Vous êtes inscrit à ce cours
        </div>
      ) : (
        <button
          onClick={handleEnroll}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
        >
          S'inscrire au cours
        </button>
      )}

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} style={{
          backgroundColor: '#1e293b',
          padding: '25px',
          borderRadius: '12px',
          marginBottom: '30px',
          border: '1px solid #2d3748',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            color: '#f8fafc',
            fontSize: '1.25rem',
            fontWeight: '500'
          }}>Votre avis</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>Note:</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(parseInt(e.target.value))}
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #3e4c5a',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                width: '100%',
                maxWidth: '150px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num} style={{ backgroundColor: '#1e293b' }}>
                  {num} {num > 1 ? 'étoiles' : 'étoile'} - {'★'.repeat(num) + '☆'.repeat(5 - num)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#e2e8f0',
              fontWeight: '500'
            }}>Commentaire:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #3e4c5a',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                transition: 'all 0.2s'
              }}
              placeholder="Partagez votre expérience avec ce cours..."
              required
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '10px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => !submitting && (e.target.style.backgroundColor = '#059669')}
              onMouseLeave={(e) => !submitting && (e.target.style.backgroundColor = '#10b981')}
              onMouseDown={(e) => !submitting && (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => !submitting && (e.target.style.transform = 'scale(1)')}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>

                  <span>Publier mon avis</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#94a3b8',
                border: '1px solid #475569',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.target.color = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.target.backgroundColor = 'transparent';
                e.target.color = '#94a3b8';
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              <span>Annuler</span>
            </button>
          </div>
        </form>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2 style={{
          fontSize: '1.5rem',
          color: '#f8fafc',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid #2d3748',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>📝</span> Avis des étudiants
        </h2>

        {isAuthenticated && enrolled && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '25px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            <span>✏️</span> Laisser un avis
          </button>
        )}

        {reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <div key={review._id} style={{
                border: '1px solid #2d3748',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#1e293b',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ color: '#f1c40f', fontSize: '20px', marginBottom: '10px' }}>
                  {renderStars(review.rating)}
                </div>
                <p style={{ color: '#e2e8f0', lineHeight: '1.5', marginBottom: '10px' }}>{review.comment}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Par <span style={{ color: '#e2e8f0', fontWeight: '500' }}>
                    {review.user?.name || review.user?.username || 'Utilisateur anonyme'}
                  </span> • {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px dashed #475569',
            borderRadius: '12px',
            padding: '30px 20px',
            textAlign: 'center',
            margin: '20px 0'
          }}>
            <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
              Aucun avis pour le moment. Soyez le premier à donner votre avis !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetails;