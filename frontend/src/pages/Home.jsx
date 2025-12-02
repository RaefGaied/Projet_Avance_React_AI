import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px 20px",
        backgroundColor: "#f4f6f8",
        minHeight: "80vh",
      }}
    >
      <h1 style={{ fontSize: "48px", color: "#2c3e50" }}>
        Bienvenue sur EduPlatform
      </h1>
      <p style={{ fontSize: "20px", color: "#555", marginTop: "20px" }}>
        Découvrez des cours et développez vos compétences en ligne.
      </p>

      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link
          to="/courses"
          style={{
            padding: "15px 30px",
            backgroundColor: "#3498db",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          Voir les cours
        </Link>

        <Link
          to="/register"
          style={{
            padding: "15px 30px",
            backgroundColor: "#27ae60",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          S'inscrire
        </Link>
      </div>
    </div>
  );
}

export default Home;
