import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function MyReviews() {
  const navigate = useNavigate();
  const { user, isAuthenticated, enrolledCourses } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchUserReviews();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isAuthenticated && enrolledCourses.length > 0) {
      setAvailableCourses(enrolledCourses);
    } else {
      setAvailableCourses([]);
    }
  }, [isAuthenticated, enrolledCourses]);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/user/${user._id}`);
      setReviews(response.data);
      setTotalReviews(response.data.length);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4) return "Excellent";
    if (rating >= 3) return "Bon";
    if (rating >= 2) return "Moyen";
    return "Médiocre";
  };

  const handleEditReview = (reviewId) => {
    const review = reviews.find(r => r._id === reviewId);
    if (review) {
      navigate(`/courses/${review.course._id}?editReview=${reviewId}`);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        setTotalReviews(prev => prev - 1);
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
  };

  const isCourseReviewed = (courseId) => {
    return reviews.some(review => review.course?._id === courseId);
  };

  const filteredReviews = [...reviews]; 

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Connectez-vous pour voir vos avis</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
        <Link to="/login" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '5px', marginTop: '15px' }}>
          Se connecter
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0', fontSize: '18px', color: '#666' }}>
        <p>Chargement de vos avis...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Mes Avis</h1>
        <button
          onClick={() => fetchUserReviews()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          🔄 Actualiser
        </button>
      </div>

      {/* Compteur d'avis total */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#2c3e50'
        }}>{totalReviews}</div>
        <div style={{
          color: '#7f8c8d',
          fontSize: '16px',
          whiteSpace: 'nowrap'
        }}>
          {totalReviews <= 1 ? 'Avis' : 'Avis au total'}
        </div>
      </div>

      {/* Liste des avis */}
      <div style={{ marginTop: '20px' }}>
        <h2 style={{
          fontSize: '20px',
          color: '#2c3e50',
          margin: '30px 0 15px 0',
          paddingBottom: '10px',
          borderBottom: '1px solid #eee'
        }}>Mes Avis Récents</h2>

        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review._id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#2c3e50',
                  margin: 0
                }}>
                  <Link to={`/courses/${review.course?._id}`} style={{ color: '#3498db', textDecoration: 'none' }}>
                    {review.course?.title || "Cours supprimé"}
                  </Link>
                </h3>
                <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <div style={{
                color: '#f1c40f',
                fontSize: '18px',
                margin: '10px 0'
              }}>
                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                <span style={{ marginLeft: '10px', color: '#7f8c8d', fontSize: '14px' }}>
                  {getRatingLabel(review.rating)}
                </span>
              </div>
              <p style={{
                color: '#333',
                lineHeight: '1.6',
                marginBottom: '15px'
              }}>{review.comment}</p>
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '15px'
              }}>
                <button
                  onClick={() => handleEditReview(review._id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#7f8c8d',
            padding: '40px 0',
            fontSize: '16px'
          }}>
            <p>Aucun avis ne correspond à votre filtre.</p>
          </div>
        )}
      </div>

      {/* Section des cours à noter */}
      {isAuthenticated && availableCourses.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{
            fontSize: '20px',
            color: '#2c3e50',
            margin: '30px 0 15px 0',
            paddingBottom: '10px',
            borderBottom: '1px solid #eee'
          }}><span>📚</span> Vos cours à noter</h2>

          {availableCourses.filter(course => !isCourseReviewed(course._id)).length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {availableCourses
                .filter(course => !isCourseReviewed(course._id))
                .map(course => (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    onClick={(e) => handleLeaveReview(course._id, e)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      padding: '20px',
                      textDecoration: 'none',
                      color: 'inherit',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                  >
                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{course.title}</h3>
                    <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
                      {course.description?.substring(0, 100)}{course.description?.length > 100 ? '...' : ''}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee'
                    }}>
                      <span style={{
                        color: '#27ae60',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}>
                        Laisser un avis
                      </span>
                      <span style={{
                        color: '#3498db',
                        fontSize: '14px'
                      }}>
                        Voir le cours →
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '15px' }}>🎉</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Vous avez noté tous vos cours !</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Merci d'avoir partagé votre avis sur tous vos cours.</p>
              <Link
                to="/courses"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
              >
                Explorer d'autres cours
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyReviews;