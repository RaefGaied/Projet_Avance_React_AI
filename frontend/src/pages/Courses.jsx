import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filtrer les cours par recherche
  const filteredCourses = courses.filter(course => {
    return searchTerm === "" || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          textAlign: "center",
          padding: "50px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{
            width: "60px",
            height: "60px",
            margin: "0 auto 20px",
            border: "4px solid #e1e5e9",
            borderTopColor: "#667eea",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          <p style={{
            color: "#333",
            fontSize: "18px",
            fontWeight: "600",
            margin: "0"
          }}>
            Chargement des cours...
          </p>
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "30px 20px"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* HEADER SECTION */}
        <div style={{
          marginBottom: "40px",
          textAlign: "center"
        }}>
          <h1 style={{
            color: "#333",
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "10px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Explorez Nos Cours
          </h1>
          <p style={{
            color: "#666",
            fontSize: "18px",
            maxWidth: "600px",
            margin: "0 auto 30px"
          }}>
            Découvrez une variété de cours conçus pour booster vos compétences
          </p>

          {/* SEARCH BAR */}
          <div style={{
            maxWidth: "600px",
            margin: "0 auto 30px",
            position: "relative"
          }}>
            <input
              type="text"
              placeholder="Rechercher un cours, un sujet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "18px 50px 18px 20px",
                border: "2px solid #e1e5e9",
                borderRadius: "15px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
            />
            <span style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "20px",
              color: "#667eea"
            }}>
              🔍
            </span>
          </div>

          {/* RESULTS COUNT */}
          <div style={{
            color: "#666",
            fontSize: "14px",
            textAlign: "left",
            maxWidth: "1200px",
            margin: "0 auto 20px"
          }}>
            {filteredCourses.length} cours trouvés
          </div>
        </div>

        {/* COURSES GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: "30px",
          padding: "20px 0"
        }}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  position: "relative"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
                }}
              >
                {/* COURSE HEADER */}
                <div style={{
                  height: "150px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  position: "relative"
                }}>
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(5px)",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    Cours
                  </div>
                </div>

                {/* COURSE CONTENT */}
                <div style={{ padding: "25px" }}>
                  <h3 style={{
                    color: "#333",
                    fontSize: "20px",
                    fontWeight: "700",
                    marginBottom: "10px",
                    lineHeight: "1.3"
                  }}>
                    {course.title}
                  </h3>
                  
                  <p style={{
                    color: "#666",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                    height: "65px",
                    overflow: "hidden"
                  }}>
                    {course.description.substring(0, 120)}...
                  </p>

                  {/* INSTRUCTOR INFO */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #f0f0f0"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "600",
                      fontSize: "16px"
                    }}>
                      {course.instructor?.charAt(0) || "I"}
                    </div>
                    <div>
                      <p style={{
                        color: "#333",
                        fontWeight: "600",
                        fontSize: "14px",
                        margin: "0"
                      }}>
                        {course.instructor || "Instructeur"}
                      </p>
                      <p style={{
                        color: "#999",
                        fontSize: "12px",
                        margin: "3px 0 0 0"
                      }}>
                        Expert
                      </p>
                    </div>
                  </div>

                  {/* COURSE STATS */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}>
                      <span style={{ fontSize: "18px", color: "#667eea" }}>👥</span>
                      <span style={{
                        color: "#333",
                        fontWeight: "600",
                        fontSize: "14px"
                      }}>
                        {course.students?.length || 0} étudiants
                      </span>
                    </div>
                  </div>

                  {/* VIEW DETAILS BUTTON */}
                  <Link
                    to={`/courses/${course._id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "14px",
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
                    Voir le cours
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "60px",
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)"
            }}>
              <div style={{
                fontSize: "60px",
                marginBottom: "20px"
              }}>
                📚
              </div>
              <h3 style={{
                color: "#333",
                fontSize: "24px",
                marginBottom: "10px"
              }}>
                Aucun cours trouvé
              </h3>
              <p style={{
                color: "#666",
                fontSize: "16px",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>

        {/* FOOTER NOTE */}
        <div style={{
          textAlign: "center",
          marginTop: "50px",
          paddingTop: "30px",
          borderTop: "1px solid #e1e5e9"
        }}>
          <p style={{
            color: "#999",
            fontSize: "14px"
          }}>
            Tous les cours sont créés par des experts certifiés • Certification incluse • Support 24/7
          </p>
        </div>
      </div>
    </div>
  );
}

export default Courses;