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

  const filteredReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (!isAuthenticated) {
    return (
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: '#1e293b',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #2d3748',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: '#f8fafc',
            fontSize: '1.8rem',
            marginBottom: '15px',
            fontWeight: '600'
          }}>Connectez-vous pour voir vos avis</h2>
          <p style={{
            color: '#94a3b8',
            fontSize: '1.1rem',
            marginBottom: '25px',
            lineHeight: '1.6'
          }}>Vous devez être connecté pour accéder à cette page.</p>
          <Link
            to="/login"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'all 0.2s',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        backgroundColor: '#0f172a',
        color: '#e2e8f0'
      }}>
        <div>
          <div style={{
            border: '4px solid rgba(255, 255, 255, 0.1)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            borderTopColor: '#60a5fa',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }}></div>
          <p style={{ color: '#94a3b8' }}>Chargement de vos avis...</p>
        </div>
        <style>{
          `@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`
        }</style>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      minHeight: 'calc(100vh - 100px)',
      backgroundColor: '#0f172a',
      color: '#e2e8f0'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #2d3748',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            color: '#f8fafc',
            fontWeight: '600'
          }}>Mes Avis</h1>
          <div style={{
            backgroundColor: '#334155',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: '500',
            fontSize: '0.95rem',
            color: '#e2e8f0',
            border: '1px solid #475569'
          }}>
            {totalReviews} avis
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            margin: '0 0 20px 0',
            fontSize: '1.5rem',
            color: '#f8fafc',
            fontWeight: '500'
          }}>
            Historique des avis
          </h2>

          {filteredReviews.length > 0 ? (
            <div style={{ display: 'grid', gap: '20px' }}>
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    border: '1px solid #2d3748',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#1e293b',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.borderColor = '#3b82f6';
                    e.currentTarget.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.borderColor = '#2d3748';
                    e.currentTarget.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{
                        margin: '0 0 5px 0',
                        fontSize: '1.2rem',
                        color: '#f8fafc'
                      }}>
                        {review.course?.title || 'Cours supprimé'}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          backgroundColor: '#334155',
                          padding: '3px 10px',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          border: '1px solid #475569'
                        }}>
                          <span style={{ color: '#fbbf24' }}>★</span>
                          <span>{review.rating}/5</span>
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                            ({getRatingLabel(review.rating)})
                          </span>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                          Le {formatDate(review.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleEditReview(review._id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#3b82f6';
                        }}
                        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <span>✏️</span> Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: '1px solid #ef4444',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.backgroundColor = 'transparent';
                        }}
                        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <span>🗑️</span> Supprimer
                      </button>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#1e293b',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '15px',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.6',
                    color: '#e2e8f0',
                    border: '1px solid #2d3748'
                  }}>
                    {review.comment}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#1e293b',
              borderRadius: '10px',
              border: '1px dashed #475569',
              marginTop: '20px'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '15px',
                color: '#3b82f6'
              }}>
                ✍️
              </div>
              <h3 style={{
                color: '#f8fafc',
                margin: '0 0 10px 0',
                fontSize: '1.3rem',
                fontWeight: '500'
              }}>
                Aucun avis pour le moment
              </h3>
              <p style={{
                color: '#94a3b8',
                margin: '0 0 20px 0',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: '1.6'
              }}>
                Vous n'avez pas encore laissé d'avis sur les cours que vous suivez.
              </p>
            </div>
          )}
        </div>
      </div>

      {availableCourses.length > 0 && (
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          padding: '30px',
          border: '1px solid #2d3748',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            margin: '0 0 20px 0',
            fontSize: '1.5rem',
            color: '#f8fafc',
            fontWeight: '500'
          }}>
            Vos cours
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {availableCourses.map((course) => (
              <div
                key={course._id}
                style={{
                  border: '1px solid #2d3748',
                  borderRadius: '10px',
                  padding: '20px',
                  backgroundColor: '#1e293b',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.borderColor = '#3b82f6';
                  e.currentTarget.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.borderColor = '#2d3748';
                  e.currentTarget.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{
                  margin: '0 0 10px 0',
                  fontSize: '1.1rem',
                  color: '#f8fafc',
                  fontWeight: '500'
                }}>
                  {course.title}
                </h3>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  margin: '0 0 20px 0',
                  flex: '1',
                  lineHeight: '1.6'
                }}>
                  {course.description?.substring(0, 100)}{course.description?.length > 100 ? '...' : ''}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  <Link
                    to={`/courses/${course._id}`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      alignSelf: 'flex-start',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#3b82f6';
                    }}
                    onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
                    onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {reviews.some(r => r.course?._id === course._id) ? 'Voir ou modifier mon avis' : 'Ajouter un avis'}
                  </Link>
                  {reviews.some(r => r.course?._id === course._id) && (
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span>✓</span> Vous pouvez soumettre plusieurs avis pour ce cours
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReviews;