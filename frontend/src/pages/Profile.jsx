import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Profile() {
  const { user, enrolledCourses, loading: authLoading, refreshCourses } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    progress: 0
  });

  useEffect(() => {
    if (user) {
      calculateStats();
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

  const handleRefresh = () => {
    if (user?._id) {
      setProfileLoading(true);
      refreshCourses();
      setTimeout(() => setProfileLoading(false), 500);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "50px",
            height: "50px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ color: "#666" }}>Chargement du profil...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        padding: "20px"
      }}>
        <div style={{
          textAlign: "center",
          maxWidth: "500px"
        }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>🔒</div>
          <h2 style={{ color: "#333", marginBottom: "15px" }}>
            Connectez-vous pour accéder à votre profil
          </h2>
          <p style={{ color: "#666", marginBottom: "30px" }}>
            Vous devez être connecté pour voir votre profil et vos cours.
          </p>
          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <Link
              to="/login"
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: "#667eea",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "600",
                border: "2px solid #667eea",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "transparent";
                e.target.style.color = "#667eea";
              }}
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "30px 20px"
    }}>
      {/* Bouton Modifier le profil */}
      <div style={{
        position: 'fixed',
        top: '100px',
        right: '30px',
        zIndex: 1000
      }}>
        <Link
          to="/profile/edit"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#667eea',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#5a67d8';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#667eea';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          ✏️ Modifier le profil
        </Link>
      </div>
      
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* HEADER DU PROFIL */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h1 style={{
              color: "#333",
              fontSize: "36px",
              fontWeight: "800",
              marginBottom: "10px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Mon Profil
            </h1>
            <p style={{ color: "#666", fontSize: "16px" }}>
              Gérez vos informations et suivez votre progression
            </p>
          </div>

          <button
            onClick={handleRefresh}
            style={{
              padding: "10px 20px",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#667eea",
              border: "1px solid #667eea",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#667eea";
              e.target.style.color = "white";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.9)";
              e.target.style.color = "#667eea";
            }}
          >
            <span>🔄</span>
            Actualiser
          </button>
        </div>

        {/* INFORMATIONS UTILISATEUR ET STATISTIQUES */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "30px",
          marginBottom: "40px"
        }}>
          {/* AVATAR ET INFOS BASIQUES */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            <div>
              <div style={{
                width: "120px",
                height: "120px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "48px",
                margin: "0 auto 20px"
              }}>
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <h2 style={{
                color: "#333",
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "5px"
              }}>
                {user.username}
              </h2>

              <p style={{
                color: "#666",
                fontSize: "14px",
                marginBottom: "20px"
              }}>
                {user.email}
              </p>
            </div>

            <div style={{
              padding: "12px",
              background: "#f8f9ff",
              borderRadius: "12px",
              fontSize: "14px",
              color: "#667eea",
              fontWeight: "600",
            }}>
              <div style={{ fontSize: "32px", color: "#667eea", marginBottom: "10px" }}>📚</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>
                {stats.totalCourses}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Cours inscrits</div>
            </div>

            <div style={{
              textAlign: "center",
              padding: "20px",
              background: "#fff5f5",
              borderRadius: "15px"
            }}>
              <div style={{ fontSize: "32px", color: "#ff6b6b", marginBottom: "10px" }}>✅</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>
                {stats.completedCourses}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Cours terminés</div>
            </div>

            <div style={{
              textAlign: "center",
              padding: "20px",
              background: "#f5fff8",
              borderRadius: "15px"
            }}>
              <div style={{ fontSize: "32px", color: "#4CAF50", marginBottom: "10px" }}>📈</div>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>
                {stats.progress}%
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Progression globale</div>
            </div>
          </div>

          {/* MES STATISTIQUES */}
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
          }}>
            <h2 style={{
              color: "#333",
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "25px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span>📊</span>
              Mes Statistiques
            </h2>

            {/* BARRE DE PROGRESSION */}
            <div style={{ marginBottom: "30px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px"
              }}>
                <span style={{ color: "#333", fontWeight: "600", fontSize: "14px" }}>
                  Progression d'apprentissage
                </span>
                <span style={{ color: "#667eea", fontWeight: "600", fontSize: "14px" }}>
                  {stats.progress}%
                </span>
              </div>
              <div style={{
                height: "10px",
                background: "#e1e5e9",
                borderRadius: "5px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${stats.progress}%`,
                  height: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "5px",
                  transition: "width 0.5s ease"
                }} />
              </div>
            </div>

            {/* DÉTAILS DES STATS */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px"
            }}>
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "#f8f9ff",
                borderRadius: "15px"
              }}>
                <div style={{ fontSize: "32px", color: "#667eea", marginBottom: "10px" }}>📚</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>
                  {stats.totalCourses}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Cours inscrits</div>
              </div>

              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "#fff5f5",
                borderRadius: "15px"
              }}>
                <div style={{ fontSize: "32px", color: "#ff6b6b", marginBottom: "10px" }}>✅</div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#333" }}>
                  {stats.completedCourses}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Cours terminés</div>
              </div>
            </div>
          </div>
        </div>

        {/* MES COURS */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          marginBottom: "30px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px"
          }}>
            <h2 style={{
              color: "#333",
              fontSize: "24px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <span>🎓</span>
              Mes Cours ({enrolledCourses.length})
            </h2>

            <Link
              to="/courses"
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Explorer plus de cours
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "50px"
            }}>
              <div style={{ fontSize: "60px", marginBottom: "20px" }}>📚</div>
              <h3 style={{
                color: "#333",
                fontSize: "20px",
                marginBottom: "10px"
              }}>
                Aucun cours pour le moment
              </h3>
              <p style={{
                color: "#666",
                fontSize: "16px",
                marginBottom: "30px",
                maxWidth: "400px",
                margin: "0 auto 30px"
              }}>
                Commencez votre parcours d'apprentissage en vous inscrivant à un cours.
              </p>
              <Link
                to="/courses"
                style={{
                  padding: "12px 30px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  fontSize: "15px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Explorer les cours
              </Link>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "25px"
            }}>
              {enrolledCourses.map((course) => (
                <div
                  key={course._id || course}
                  style={{
                    background: "white",
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    border: "1px solid #f0f0f0"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.08)";
                  }}
                >
                  <Link
                    to={`/courses/${course._id || course}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{
                      height: "120px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      position: "relative"
                    }}>
                      <div style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(5px)",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        Inscrit
                      </div>
                      <div style={{
                        position: "absolute",
                        bottom: "15px",
                        left: "15px",
                        fontSize: "24px",
                        color: "white"
                      }}>
                        {course.emoji || "📚"}
                      </div>
                    </div>

                    <div style={{ padding: "20px" }}>
                      <h3 style={{
                        color: "#333",
                        fontSize: "18px",
                        fontWeight: "700",
                        marginBottom: "10px",
                        lineHeight: "1.3"
                      }}>
                        {typeof course === 'object' ? course.title : "Chargement..."}
                      </h3>

                      <p style={{
                        color: "#666",
                        fontSize: "14px",
                        marginBottom: "15px",
                        height: "40px",
                        overflow: "hidden",
                        lineHeight: "1.4"
                      }}>
                        {typeof course === 'object' ?
                          (course.description?.substring(0, 80) + "...") :
                          "Description du cours"}
                      </p>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px"
                      }}>
                        <div style={{
                          width: "30px",
                          height: "30px",
                          background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "600",
                          fontSize: "12px"
                        }}>
                          {typeof course === 'object' ? course.instructor?.charAt(0) || "I" : "I"}
                        </div>
                        <span style={{
                          color: "#333",
                          fontSize: "13px",
                          fontWeight: "600"
                        }}>
                          {typeof course === 'object' ? course.instructor || "Instructeur" : "Instructeur"}
                        </span>
                      </div>

                      <div style={{
                        padding: "10px",
                        background: "#f8f9ff",
                        borderRadius: "10px",
                        textAlign: "center",
                        color: "#667eea",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.3s ease"
                      }}>
                        Continuer l'apprentissage
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS DU PROFIL */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
        }}>
          <h3 style={{
            color: "#333",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "25px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span>⚙️</span>
            Actions du compte
          </h3>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px"
          }}>
            <Link
              to="/profile/edit"
              style={{
                padding: "15px",
                background: "#f8f9ff",
                color: "#667eea",
                border: "2px solid #667eea",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                textDecoration: "none",
                textAlign: "center"
              }}
              onMouseOver={(e) => {
                e.target.style.background = "#667eea";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#f8f9ff";
                e.target.style.color = "#667eea";
              }}
            >
              <span>✏️</span>
              Modifier le profil
            </Link>

            <button style={{
              padding: "15px",
              background: "#fff5f5",
              color: "#ff6b6b",
              border: "2px solid #ff6b6b",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
              onMouseOver={(e) => {
                e.target.style.background = "#ff6b6b";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#fff5f5";
                e.target.style.color = "#ff6b6b";
              }}>
              <span>🔐</span>
              Changer le mot de passe
            </button>

            <button style={{
              padding: "15px",
              background: "#fff8e1",
              color: "#FF9800",
              border: "2px solid #FF9800",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
              onMouseOver={(e) => {
                e.target.style.background = "#FF9800";
                e.target.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#fff8e1";
                e.target.style.color = "#FF9800";
              }}>
              <span>📧</span>
              Notifications
            </button>

            <button style={{
              padding: "15px",
              background: "#f5f5f5",
              color: "#666",
              border: "2px solid #ddd",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
              onMouseOver={(e) => {
                e.target.style.background = "#666";
                e.target.style.color = "white";
                e.target.style.borderColor = "#666";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "#f5f5f5";
                e.target.style.color = "#666";
                e.target.style.borderColor = "#ddd";
              }}>
              <span>📥</span>
              Exporter les données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;