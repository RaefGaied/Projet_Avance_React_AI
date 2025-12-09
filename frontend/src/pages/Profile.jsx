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
        textAlign: 'center'
      }}>
        <div>
          <div style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            borderTopColor: '#3498db',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 15px'
          }}></div>
          <p>Chargement...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
        minHeight: 'calc(100vh - 200px)'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#2c3e50',
            marginBottom: '1rem'
          }}>Découvrez nos cours</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#555',
            marginBottom: '2rem'
          }}>Connectez-vous pour vous inscrire aux cours</p>

          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            <Link
              to="/login"
              style={{
                padding: '10px 20px',
                backgroundColor: '#3498db',
                color: 'white',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#3498db',
                border: '1px solid #3498db',
                borderRadius: '5px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.2s',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.backgroundColor = '#f8f9fa';
                e.target.color = '#2980b9';
                e.target.borderColor = '#2980b9';
              }}
              onMouseLeave={(e) => {
                e.target.backgroundColor = 'transparent';
                e.target.color = '#3498db';
                e.target.borderColor = '#3498db';
              }}
            >
              Créer un compte
            </Link>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              color: '#2c3e50',
              marginBottom: '1.5rem',
              textAlign: 'center'
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
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                  }}
                >
                  <h4 style={{
                    fontSize: '1.2rem',
                    color: '#2c3e50',
                    margin: '0 0 10px 0'
                  }}>{course.title}</h4>
                  <p style={{
                    color: '#555',
                    marginBottom: '15px',
                    fontSize: '0.95rem',
                    lineHeight: '1.5'
                  }}>{course.description}</p>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      color: '#3498db',
                      border: '1px solid #3498db',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.backgroundColor = '#f8f9fa';
                      e.target.color = '#2980b9';
                      e.target.borderColor = '#2980b9';
                    }}
                    onMouseLeave={(e) => {
                      e.target.backgroundColor = 'transparent';
                      e.target.color = '#3498db';
                      e.target.borderColor = '#3498db';
                    }}
                  >
                    Connectez-vous pour vous inscrire
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
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
        padding: '30px',
        marginBottom: '30px'
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
              color: '#2c3e50',
              margin: '0 0 5px 0'
            }}>Mon Profil</h1>
            <p style={{
              color: '#7f8c8d',
              margin: 0,
              fontSize: '1rem'
            }}>Gérez vos informations et suivez votre progression</p>
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
                padding: '8px 15px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f1f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <span>🔄</span> Actualiser
            </button>
            <Link
              to="/profile/edit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 15px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '0.95rem',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2980b9';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3498db';
              }}
            >
              ✏️ Modifier
            </Link>
          </div>
        </div>

        {/* Section principale des informations */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          marginTop: '20px'
        }}>
          {/* Colonne gauche : Informations utilisateur */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '25px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
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
                backgroundColor: '#3498db',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 style={{
                  margin: '0 0 5px 0',
                  color: '#2c3e50',
                  fontSize: '1.5rem'
                }}>{user.username || 'Utilisateur'}</h2>
                <p style={{
                  margin: 0,
                  color: '#7f8c8d',
                  fontSize: '0.95rem'
                }}>Étudiant</p>
              </div>
            </div>

            <div style={{ marginBottom: '25px' }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: '#2c3e50',
                margin: '0 0 15px 0',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
              }}>Informations personnelles</h3>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #f5f5f5'
              }}>
                <span style={{
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>Nom d'utilisateur</span>
                <span style={{
                  color: '#2c3e50',
                  fontWeight: '500'
                }}>{user.username}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #f5f5f5'
              }}>
                <span style={{
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>Email</span>
                <span style={{
                  color: '#2c3e50',
                  fontWeight: '500'
                }}>{user.email}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid #f5f5f5'
              }}>
                <span style={{
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>Membre depuis</span>
                <span style={{
                  color: '#2c3e50',
                  fontWeight: '500'
                }}>
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            {user.bio && (
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: '#2c3e50',
                  margin: '0 0 15px 0',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #eee'
                }}>Bio</h3>
                <p style={{
                  color: '#555',
                  lineHeight: '1.6',
                  margin: 0
                }}>{user.bio}</p>
              </div>
            )}

            {user.website && (
              <div style={{ marginBottom: '25px' }}>
                <h3 style={{
                  fontSize: '1.1rem',
                  color: '#2c3e50',
                  margin: '0 0 15px 0',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #eee'
                }}>Site web</h3>
                <a
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#3498db',
                    textDecoration: 'none',
                    display: 'inline-block',
                    wordBreak: 'break-all',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.color = '#3498db'}
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
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
              >
                Modifier le profil
              </Link>
            </div>
          </div>

          {/* Colonne droite : Statistiques et cours */}
          <div>
            {/* Cartes de statistiques */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                minWidth: '200px',
                flex: '1 1 200px',
                maxWidth: '300px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>📚</div>
                <div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#2c3e50'
                  }}>{stats.totalCourses || 0}</div>
                  <div style={{
                    color: '#7f8c8d',
                    fontSize: '0.9rem'
                  }}>Cours suivis</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  color: '#2c3e50',
                  margin: 0
                }}>Mes cours inscrits</h3>
                <Link
                  to="/courses"
                  style={{
                    color: '#3498db',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#2980b9'}
                  onMouseLeave={(e) => e.target.style.color = '#3498db'}
                >
                  Voir tous →
                </Link>
              </div>

              {enrolledCourses.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  {enrolledCourses.map(course => (
                    <div
                      key={course._id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          margin: '0 0 8px 0',
                          color: '#2c3e50',
                          fontSize: '1.1rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>{course.title}</h4>

                        <p style={{
                          color: '#666',
                          fontSize: '0.9rem',
                          margin: '0 0 12px 0',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {course.description?.substring(0, 80)}{course.description?.length > 80 ? '...' : ''}
                        </p>
                      </div>

                      <Link
                        to={`/courses/${course._id}`}
                        style={{
                          color: '#3498db',
                          textDecoration: 'none',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          padding: '8px 15px',
                          border: '1px solid #3498db',
                          borderRadius: '5px',
                          transition: 'all 0.2s',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => {
                          e.target.backgroundColor = '#f8f9fa';
                          e.target.color = '#2980b9';
                          e.target.borderColor = '#2980b9';
                        }}
                        onMouseLeave={(e) => {
                          e.target.backgroundColor = 'transparent';
                          e.target.color = '#3498db';
                          e.target.borderColor = '#3498db';
                        }}
                      >
                        Continuer →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '15px'
                  }}>📚</div>
                  <p style={{
                    color: '#555',
                    marginBottom: '20px',
                    fontSize: '1.1rem'
                  }}>Vous n'êtes inscrit à aucun cours pour le moment.</p>
                  <Link
                    to="/courses"
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
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