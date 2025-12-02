import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    isAuthenticated,
    user,
    isEnrolledInCourse,
    addEnrolledCourse
  } = useAuth();
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est déjà inscrit à ce cours
  const enrolled = isEnrolledInCourse(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger le cours d'abord
        const courseRes = await api.get(`/courses/${id}`).catch((error) => {
          console.error("Erreur lors du chargement du cours:", error);
          return { data: null };
        });

        setCourse(courseRes.data);

        // Les reviews sont gérées côté client pour l'instant
        setReviews([]);

      } catch (err) {
        console.error("Erreur lors du chargement:", err);
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
      alert("Erreur: Impossible de récupérer votre ID utilisateur");
      return;
    }

    try {
      // Inscription via l'API - utilisez le bon endpoint d'inscription
      const response = await api.post(`/courses/${id}/enroll`, {
        userId: user._id
      });

      console.log("Réponse inscription:", response.data);

      // Met à jour le contexte avec le nouveau cours
      if (course) {
        addEnrolledCourse(course); // Passe l'objet cours complet
      } else {
        addEnrolledCourse(id); // Ou juste l'ID si course n'est pas encore chargé
      }

      alert("Inscription réussie !");

      // Recharge les données du cours pour mettre à jour le compteur
      const updatedCourse = await api.get(`/courses/${id}`);
      setCourse(updatedCourse.data);

    } catch (err) {
      console.error("Erreur d'inscription:", err);
      alert(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px"
        }}></div>
        Chargement...
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
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h3>Cours non trouvé</h3>
        <button
          onClick={() => navigate("/courses")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
          Retour aux cours
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>{course.title}</h1>
      <p style={{ fontSize: "18px", color: "#666", marginTop: "15px" }}>
        {course.description}
      </p>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#4F0A2CFF",
          borderRadius: "10px",
        }}
      >
        <p>
          <strong>Instructeur :</strong> {course.instructor}
        </p>
        <p>
          <strong>Étudiants inscrits :</strong> {course.students.length}
        </p>
      </div>

      <button
        onClick={handleEnroll}
        disabled={enrolled}
        style={{
          marginTop: "20px",
          padding: "15px 30px",
          backgroundColor: enrolled ? "#95a5a6" : "#27ae60",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: enrolled ? "not-allowed" : "pointer",
          fontSize: "16px",
          opacity: enrolled ? 0.7 : 1,
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => {
          if (!enrolled) {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }
        }}
        onMouseOut={(e) => {
          if (!enrolled) {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }
        }}
      >
        {enrolled ? "✓ Déjà inscrit" : "S'inscrire au cours"}
      </button>

      {enrolled && (
        <div style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#d4edda",
          color: "#155724",
          borderRadius: "5px",
          border: "1px solid #c3e6cb",
          animation: "fadeIn 0.5s ease"
        }}>
          ✅ Vous êtes inscrit à ce cours. Accédez-y depuis votre profil.
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </div>
      )}

      <h2 style={{ marginTop: "40px" }}>Avis des étudiants</h2>

      {reviews.length === 0 ? (
        <p style={{ color: "#999" }}>Aucun avis pour le moment</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              padding: "15px",
              marginTop: "15px",
              backgroundColor: "white",
              borderRadius: "5px",
              border: "1px solid #ddd",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ color: "#f39c12", fontSize: "20px" }}>
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </div>
            <p style={{ marginTop: "10px" }}>{review.comment}</p>
            <p style={{ color: "#999", fontSize: "12px", marginTop: "5px" }}>
              — {review.user?.username || "Anonyme"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default CourseDetails;