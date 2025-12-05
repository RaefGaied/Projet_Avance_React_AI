import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

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
          console.error("Erreur lors du chargement du cours:", error);
          return { data: null };
        });

        setCourse(courseRes.data);

      
        const reviewsRes = await api.get(`/reviews/${id}/reviews`);
        setReviews(reviewsRes.data || []);

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
      
      const response = await api.post(`/courses/${id}/enroll`, {
        userId: user._id
      });

      console.log("Réponse inscription:", response.data);

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

      console.log('Review submitted successfully:', response.data);
      setReviews([response.data, ...reviews]);
      setReviewText("");
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'avis:", err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      alert(err.response?.data?.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
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
        <p>Aucun avis pour le moment</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              padding: "15px",
              marginTop: "15px",
              backgroundColor: "skyblue",
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

      {enrolled && (
        <div style={{ marginTop: "30px" }}>
          <h3>Votre avis</h3>
          {!showReviewForm ? (
            <button
              onClick={() => setShowReviewForm(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#3498db",
                color: "yhite",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "20px"
              }}
            >
              Laisser un avis
            </button>
          ) : (
            <form onSubmit={handleSubmitReview} style={{ marginBottom: "30px" }}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Note:
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    {[5, 4, 3, 2, 1].map(num => (
                      <option key={num} value={num}>{num} étoiles</option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Partagez votre expérience avec ce cours..."
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd"
                  }}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#27ae60",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                >
                  {submitting ? "Envoi en cours..." : "Publier l'avis"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;