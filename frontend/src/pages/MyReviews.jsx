import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function MyReviews() {
  const navigate = useNavigate();
  const { user, isAuthenticated, enrolledCourses } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    positive: 0,
    neutral: 0,
    negative: 0
  });

  // Charger les avis de l'utilisateur
  useEffect(() => {
    console.log('useEffect - isAuthenticated:', isAuthenticated, 'user:', user);
    if (isAuthenticated && user?._id) {
      console.log('Fetching user reviews for user ID:', user._id);
      fetchUserReviews();
    } else {
      console.log('User not authenticated or missing user ID');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Mettre à jour les cours disponibles quand les cours inscrits changent
  useEffect(() => {
    console.log('enrolledCourses updated:', enrolledCourses);
    if (isAuthenticated && enrolledCourses.length > 0) {
      console.log('Setting available courses:', enrolledCourses);
      setAvailableCourses(enrolledCourses);
    } else {
      console.log('No enrolled courses or user not authenticated');
      setAvailableCourses([]);
    }
  }, [isAuthenticated, enrolledCourses]);

  // Vérifier si un cours a déjà été noté
  const isCourseReviewed = (courseId) => {
    return reviews.some(review => review.course?._id === courseId);
  };

  // Fonction pour rediriger vers la page du cours pour laisser un avis
  const handleLeaveReview = (courseId, e) => {
    e.preventDefault();
    navigate(`/courses/${courseId}?showReviewForm=true`);
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Fonction pour obtenir la couleur en fonction de la note
  const getRatingColor = (rating) => {
    if (rating >= 4) return "#4CAF50";
    if (rating >= 3) return "#FFC107";
    return "#F44336";
  };

  // Fonction pour obtenir le libellé de la note
  const getRatingLabel = (rating) => {
    if (rating >= 4) return "Excellent";
    if (rating >= 3) return "Bon";
    if (rating >= 2) return "Moyen";
    return "Médiocre";
  };

  // Fonction pour supprimer un avis
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet avis ?")) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        // Recalculer les statistiques
        calculateStats(reviews.filter(review => review._id !== reviewId));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'avis:", error);
      }
    }
  };

  // Fonction pour éditer un avis
  const handleEditReview = (reviewId) => {
    const review = reviews.find(r => r._id === reviewId);
    if (review) {
      navigate(`/courses/${review.course._id}?editReview=${reviewId}`);
    }
  };

  // Fonction pour rafraîchir la liste des avis
  const refreshReviews = () => {
    if (isAuthenticated && user?._id) {
      fetchUserReviews();
    }
  };

  // Fonction pour récupérer les avis de l'utilisateur
  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching reviews for user ID:', user._id);
      // URL mise à jour pour correspondre à la configuration des routes
      const response = await api.get(`/api/reviews/user/${user._id}`);
      console.log('Reviews API response:', response.data);
      setReviews(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (reviewsData) => {
    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, curr) => acc + curr.rating, 0);
    const average = total > 0 ? sum / total : 0;
    const positive = reviewsData.filter(r => r.rating >= 4).length;
    const neutral = reviewsData.filter(r => r.rating === 3).length;
    const negative = reviewsData.filter(r => r.rating <= 2).length;

    setStats({
      total,
      averageRating: average.toFixed(1),
      positive,
      neutral,
      negative
    });
  };

  // Filtrer les avis en fonction du filtre sélectionné
  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true;
    if (filter === "positive") return review.rating >= 4;
    if (filter === "neutral") return review.rating === 3;
    if (filter === "negative") return review.rating <= 2;
    return true;
  });

  // Afficher un message si l'utilisateur n'est pas connecté
  if (!isAuthenticated) {
    return (
      <div style={styles.notLoggedInContainer}>
        <h2>Connectez-vous pour voir vos avis</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
        <Link to="/login" style={styles.loginButton}>
          Se connecter
        </Link>
      </div>
    );
  }

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Chargement de vos avis...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>Mes Avis</h1>
          <button
            onClick={refreshReviews}
            style={styles.refreshButton}
          >
            🔄 Actualiser
          </button>
        </div>

        {/* Filtres */}
        <div style={styles.filters}>
          <button
            onClick={() => setFilter("all")}
            style={{
              ...styles.filterButton,
              ...(filter === "all" ? styles.activeFilter : {})
            }}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter("positive")}
            style={{
              ...styles.filterButton,
              ...(filter === "positive" ? styles.activeFilter : {})
            }}
          >
            Positifs ({stats.positive})
          </button>
          <button
            onClick={() => setFilter("neutral")}
            style={{
              ...styles.filterButton,
              ...(filter === "neutral" ? styles.activeFilter : {})
            }}
          >
            Neutres ({stats.neutral})
          </button>
          <button
            onClick={() => setFilter("negative")}
            style={{
              ...styles.filterButton,
              ...(filter === "negative" ? styles.activeFilter : {})
            }}
          >
            Négatifs ({stats.negative})
          </button>
        </div>

        {/* Statistiques */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Avis au total</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.averageRating}</div>
            <div style={styles.statLabel}>Note moyenne</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {stats.total > 0
                ? Math.round((stats.positive / stats.total) * 100)
                : 0}%
            </div>
            <div style={styles.statLabel}>Avis positifs</div>
          </div>
        </div>

        {/* Liste des avis */}
        <div style={styles.reviewsSection}>
          {filteredReviews.length === 0 ? (
            <div style={styles.noReviews}>
              <div style={styles.noReviewsIcon}>📝</div>
              <h3>Vous n'avez pas encore d'avis</h3>
              <p>Laissez un avis sur un cours pour le voir apparaître ici.</p>
              <Link to="/courses" style={styles.coursesLink}>
                Parcourir les cours
              </Link>
            </div>
          ) : (
            <div style={styles.reviewsList}>
              {filteredReviews.map((review) => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.courseInfo}>
                      <Link
                        to={`/courses/${review.course?._id || review.course}`}
                        style={styles.courseLink}
                      >
                        {review.course?.title || "Cours inconnu"}
                      </Link>
                      <div style={styles.ratingContainer}>
                        <div style={styles.ratingLabel}>
                          {getRatingLabel(review.rating)}
                        </div>
                        <div style={styles.stars}>
                          {"★".repeat(review.rating) + "☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>

                    <div style={styles.reviewMeta}>
                      <span style={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </span>
                      <div style={styles.reviewActions}>
                        <button
                          onClick={() => handleEditReview(review._id)}
                          style={styles.editButton}
                        >
                          <span>✏️</span> Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          style={styles.deleteButton}
                        >
                          <span>🗑️</span> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={styles.reviewContent}>
                    <p style={styles.reviewText}>
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section des cours à noter */}
        {isAuthenticated && availableCourses.length > 0 && (
          <div style={styles.coursesToReviewSection}>
            <h2 style={styles.sectionTitle}>
              <span>📚</span> Vos cours à noter
            </h2>

            {availableCourses.filter(course => !isCourseReviewed(course._id)).length > 0 ? (
              <div style={styles.coursesGrid}>
                {availableCourses
                  .filter(course => !isCourseReviewed(course._id))
                  .map(course => (
                    <Link
                      key={course._id}
                      to={`/courses/${course._id}`}
                      onClick={(e) => handleLeaveReview(course._id, e)}
                      style={styles.courseCard}
                    >
                      <h3 style={styles.courseTitle}>
                        {course.title}
                      </h3>
                      <p style={styles.courseDescription}>
                        {course.description?.substring(0, 100)}...
                      </p>
                      <div style={styles.courseActions}>
                        <span style={styles.reviewButton}>
                          Laisser un avis
                        </span>
                        <span style={styles.viewCourseButton}>
                          Voir le cours →
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            ) : (
              <div style={styles.allReviewed}>
                <div style={styles.allReviewedIcon}>🎉</div>
                <h3>Vous avez noté tous vos cours !</h3>
                <p>Merci d'avoir partagé votre avis sur tous vos cours.</p>
                <Link to="/courses" style={styles.exploreButton}>
                  Explorer d'autres cours
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    padding: "30px 20px"
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px"
  },
  title: {
    color: "#2d3748",
    fontSize: "32px",
    fontWeight: "700",
    margin: 0
  },
  refreshButton: {
    background: "#4a5568",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease"
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  filterButton: {
    padding: "8px 16px",
    background: "transparent",
    border: "1px solid #cbd5e0",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#4a5568",
    fontSize: "14px",
    transition: "all 0.2s ease"
  },
  activeFilter: {
    background: "#4a5568",
    color: "white",
    borderColor: "#4a5568"
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "40px"
  },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "8px"
  },
  statLabel: {
    color: "#718096",
    fontSize: "14px"
  },
  reviewsSection: {
    marginBottom: "50px"
  },
  noReviews: {
    background: "white",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  noReviewsIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  coursesLink: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    background: "#4a5568",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  reviewCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
    flexWrap: "wrap",
    gap: "15px"
  },
  courseInfo: {
    flex: 1
  },
  courseLink: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    textDecoration: "none",
    marginBottom: "8px",
    display: "block"
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  ratingLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#4a5568"
  },
  stars: {
    color: "#F59E0B",
    fontSize: "16px"
  },
  reviewMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px"
  },
  reviewDate: {
    color: "#718096",
    fontSize: "12px",
    whiteSpace: "nowrap"
  },
  reviewActions: {
    display: "flex",
    gap: "8px"
  },
  editButton: {
    padding: "6px 12px",
    background: "transparent",
    color: "#4a5568",
    border: "1px solid #cbd5e0",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease"
  },
  deleteButton: {
    padding: "6px 12px",
    background: "transparent",
    color: "#e53e3e",
    border: "1px solid #feb2b2",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease"
  },
  reviewContent: {
    marginTop: "15px"
  },
  reviewText: {
    color: "#4a5568",
    lineHeight: "1.6",
    margin: 0
  },
  coursesToReviewSection: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    marginTop: "30px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
  },
  sectionTitle: {
    color: "#2d3748",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 25px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  courseCard: {
    background: "#f8f9ff",
    borderRadius: "12px",
    padding: "20px",
    textDecoration: "none",
    color: "inherit",
    transition: "all 0.3s ease",
    border: "1px solid #e0e4ff",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    margin: 0
  },
  courseDescription: {
    color: "#718096",
    fontSize: "14px",
    margin: 0,
    flexGrow: 1
  },
  courseActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px"
  },
  reviewButton: {
    background: "#48bb78",
    color: "white",
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  viewCourseButton: {
    color: "#667eea",
    fontSize: "14px",
    fontWeight: "600"
  },
  allReviewed: {
    textAlign: "center",
    padding: "30px",
    background: "#f0fff4",
    borderRadius: "12px"
  },
  allReviewedIcon: {
    fontSize: "40px",
    marginBottom: "15px"
  },
  exploreButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "10px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease"
  },
  notLoggedInContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    textAlign: "center",
    padding: "20px"
  },
  loginButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 24px",
    background: "#4a5568",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "16px",
    transition: "all 0.3s ease"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderLeftColor: "#4a5568",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  },
  "@keyframes spin": {
    to: { transform: "rotate(360deg)" }
  }
};

export default MyReviews;
