import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, enrolledCourses, loading: authLoading, refreshCourses } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    progress: 0
  });

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
        const data = await response.json();
        setAllCourses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
      }
    };

    fetchAllCourses();

    if (user) {
      calculateStats();
      setProfileLoading(false);
    } else {
      setProfileLoading(false);
    }
  }, [user, enrolledCourses]);

  const calculateStats = () => {
    if (!enrolledCourses.length) return;
    const totalCourses = enrolledCourses.length;
    const completedCourses = Math.floor(totalCourses * 0.3);
    const progress = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    setStats({
      totalCourses,
      completedCourses,
      progress
    });
  };

  if (authLoading || profileLoading) {
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
          <p style={{ color: '#94a3b8' }}>Chargement...</p>
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

  if (!user) {
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
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px',
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #2d3748',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#f8fafc',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>Découvrez nos cours</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>Connectez-vous pour accéder à votre profil et suivre votre progression</p>

          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '3rem',
            flexWrap: 'wrap'
          }}>
            <Link
              to="/login"
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                minWidth: '160px',
                textAlign: 'center',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#60a5fa',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                cursor: 'pointer',
                fontSize: '1rem',
                minWidth: '160px',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.target.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                e.target.color = '#93c5fd';
                e.target.borderColor = '#60a5fa';
              }}
              onMouseLeave={(e) => {
                e.target.backgroundColor = 'transparent';
                e.target.color = '#60a5fa';
                e.target.borderColor = '#3b82f6';
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              Créer un compte
            </Link>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#f8fafc',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '600'
            }}>Cours disponibles</h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {allCourses.map(course => (
                <div
                  key={course._id}
                  style={{
                    border: '1px solid #2d3748',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#1e293b',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#2d3748';
                  }}
                >
                  <h4 style={{
                    fontSize: '1.2rem',
                    color: '#f8fafc',
                    margin: '0 0 10px 0',
                    fontWeight: '600'
                  }}>{course.title}</h4>
                  <p style={{
                    color: '#94a3b8',
                    marginBottom: '20px',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    flex: '1'
                  }}>
                    {course.description?.substring(0, 150)}{course.description?.length > 150 ? '...' : ''}
                  </p>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      color: '#60a5fa',
                      border: '1px solid #3b82f6',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      marginTop: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      e.target.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                      e.target.color = '#93c5fd';
                      e.target.borderColor = '#60a5fa';
                    }}
                    onMouseLeave={(e) => {
                      e.target.backgroundColor = 'transparent';
                      e.target.color = '#60a5fa';
                      e.target.borderColor = '#3b82f6';
                    }}
                  >
                    Se connecter pour s'inscrire
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
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
      {/* En-tête du profil */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid #2d3748'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              color: '#f8fafc',
              margin: '0 0 8px 0',
              fontWeight: '600'
            }}>Mon Profil</h1>
            <p style={{
              color: '#94a3b8',
              margin: 0,
              fontSize: '1rem',
              maxWidth: '600px',
              lineHeight: '1.5'
            }}>
              Gérez vos informations et suivez votre progression dans les cours
            </p>
          </div>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={refreshCourses}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#334155',
                color: '#e2e8f0',
                border: '1px solid #475569',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#3e4c5e';
                e.currentTarget.style.borderColor = '#64748b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.borderColor = '#475569';
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span>🔄</span> Actualiser
            </button>
          </div>
        </div>

        {/* Section principale */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          marginTop: '20px'
        }}>
          {/* Colonne de gauche - Informations du profil */}
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            border: '1px solid #2d3748',
            height: 'fit-content'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '25px',
              gap: '15px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
              }}>
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 style={{
                  margin: '0 0 5px 0',
                  color: '#f8fafc',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>{user.username || 'Utilisateur'}</h2>
                <p style={{
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: '0.95rem'
                }}>Étudiant</p>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: '#f8fafc',
                margin: '0 0 15px 0',
                paddingBottom: '10px',
                borderBottom: '1px solid #2d3748',
                fontWeight: '500'
              }}>Informations personnelles</h3>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #2d3748'
              }}>
                <span style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem'
                }}>Nom d'utilisateur</span>
                <span style={{
                  color: '#f8fafc',
                  fontWeight: '500',
                  textAlign: 'right'
                }}>{user.username || 'Non défini'}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #2d3748'
              }}>
                <span style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem'
                }}>Email</span>
                <span style={{
                  color: '#f8fafc',
                  fontWeight: '500',
                  textAlign: 'right',
                  wordBreak: 'break-all',
                  marginLeft: '10px'
                }}>{user.email || 'Non défini'}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #2d3748'
              }}>
                <span style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem'
                }}>Membre depuis</span>
                <span style={{
                  color: '#f8fafc',
                  fontWeight: '500'
                }}>
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {user.bio && (
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: '#f8fafc',
                  margin: '0 0 15px 0',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #2d3748',
                  fontWeight: '500'
                }}>Bio</h3>
                <p style={{
                  color: '#e2e8f0',
                  lineHeight: '1.6',
                  margin: 0,
                  fontSize: '0.95rem'
                }}>{user.bio}</p>
              </div>
            )}

            {user.website && (
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: '#f8fafc',
                  margin: '0 0 15px 0',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #2d3748',
                  fontWeight: '500'
                }}>Site web</h3>
                <a
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#60a5fa',
                    textDecoration: 'none',
                    display: 'inline-block',
                    wordBreak: 'break-all',
                    transition: 'color 0.2s',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#93c5fd'}
                  onMouseLeave={(e) => e.target.style.color = '#60a5fa'}
                >
                  {user.website}
                </a>
              </div>
            )}

            <div style={{ marginTop: '30px' }}>
              <Link
                to="/profile/edit"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '1rem',
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
                Modifier le profil
              </Link>
            </div>
          </div>

          {/* Colonne de droite - Statistiques et cours */}
          <div>
            {/* Cartes de statistiques */}
            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                backgroundColor: '#1e293b',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #2d3748',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                minWidth: '200px',
                maxWidth: '300px',
                flex: '1'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  color: '#60a5fa'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                  </svg>
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '600',
                  color: '#f8fafc',
                  marginBottom: '5px',
                  lineHeight: '1.2'
                }}>
                  {stats.totalCourses}
                </div>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '0.9rem'
                }}>
                  Cours suivis
                </div>
              </div>
            </div>

            {/* Section des cours */}
            <div style={{
              backgroundColor: '#1e293b',
              borderRadius: '10px',
              padding: '25px',
              border: '1px solid #2d3748',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                flexWrap: 'wrap',
                gap: '15px'
              }}>
                <h2 style={{
                  margin: 0,
                  color: '#f8fafc',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  Mes cours
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <Link
                    to="/courses"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
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
                    <span>🔍</span> Parcourir
                  </Link>
                </div>
              </div>

              {enrolledCourses.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {enrolledCourses.map((course) => (
                    <div
                      key={course._id}
                      style={{
                        backgroundColor: '#1e293b',
                        borderRadius: '10px',
                        border: '1px solid #2d3748',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#2d3748';
                      }}
                    >
                      <div style={{
                        height: '120px',
                        backgroundColor: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#334155',
                        fontSize: '2rem',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              position: 'absolute',
                              top: 0,
                              left: 0
                            }}
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#0f172a',
                            color: '#334155',
                            fontSize: '2rem'
                          }}>
                            {course.title?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                        )}
                      </div>
                      <div style={{
                        padding: '20px',
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <div style={{
                          marginBottom: '15px',
                          flex: '1'
                        }}>
                          <h3 style={{
                            margin: '0 0 10px 0',
                            color: '#f8fafc',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            lineHeight: '1.4'
                          }}>
                            {course.title || 'Titre du cours'}
                          </h3>
                          <p style={{
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            margin: '0 0 15px 0',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {course.description || 'Aucune description disponible'}
                          </p>
                        </div>

                        <div style={{
                          marginTop: 'auto',
                          paddingTop: '15px',
                          borderTop: '1px solid #2d3748'
                        }}>
                          <Link
                            to={`/courses/${course._id}`}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '10px',
                              backgroundColor: 'transparent',
                              color: '#60a5fa',
                              border: '1px solid #3b82f6',
                              borderRadius: '6px',
                              textAlign: 'center',
                              textDecoration: 'none',
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                              e.target.style.color = '#93c5fd';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.color = '#60a5fa';
                            }}
                          >
                            Continuer la formation
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px dashed #475569',
                  marginTop: '20px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    color: '#3b82f6',
                    fontSize: '2rem'
                  }}>
                    📚
                  </div>
                  <h3 style={{
                    color: '#f8fafc',
                    margin: '0 0 10px 0',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    Aucun cours suivi
                  </h3>
                  <p style={{
                    color: '#94a3b8',
                    margin: '0 0 20px 0',
                    maxWidth: '400px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    lineHeight: '1.5'
                  }}>
                    Vous ne suivez aucun cours pour le moment. Parcourez notre catalogue pour trouver des cours intéressants.
                  </p>
                  <Link
                    to="/courses"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      border: 'none',
                      cursor: 'pointer'
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
                    Parcourir les cours
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
