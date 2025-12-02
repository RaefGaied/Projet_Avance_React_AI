import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(username, email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "40px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "20px",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ 
            color: "#333", 
            margin: "0 0 10px 0",
            fontSize: "28px",
            fontWeight: "700",
          }}>
            Créer un compte
          </h2>
          <p style={{ 
            color: "#666", 
            fontSize: "14px",
            margin: "0"
          }}>
            Rejoignez notre communauté
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 15px",
              marginBottom: "20px",
              backgroundColor: "rgba(255, 87, 87, 0.1)",
              color: "#ff5757",
              borderRadius: "10px",
              border: "1px solid rgba(255, 87, 87, 0.3)",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#444",
              fontSize: "14px"
            }}>
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
              placeholder="Choisissez un nom d'utilisateur"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#444",
              fontSize: "14px"
            }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
              placeholder="votre@email.com"
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px", 
              fontWeight: "600",
              color: "#444",
              fontSize: "14px"
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e1e5e9",
                borderRadius: "12px",
                fontSize: "15px",
                transition: "all 0.3s ease",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e1e5e9"}
              placeholder="Minimum 6 caractères"
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              marginBottom: "20px"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            S'inscrire
          </button>
        </form>

        <div style={{ 
          textAlign: "center", 
          marginTop: "25px", 
          paddingTop: "25px",
          borderTop: "1px solid #eee"
        }}>
          <p style={{ 
            color: "#666", 
            fontSize: "14px",
            margin: "0"
          }}>
            Déjà un compte ?{" "}
            <Link 
              to="/login" 
              style={{ 
                color: "#667eea", 
                textDecoration: "none",
                fontWeight: "600",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => e.target.style.color = "#764ba2"}
              onMouseOut={(e) => e.target.style.color = "#667eea"}
            >
              Se connecter
            </Link>
          </p>
        </div>

        <div style={{ 
          textAlign: "center", 
          marginTop: "20px",
          fontSize: "12px",
          color: "#999"
        }}>
          <p>En vous inscrivant, vous acceptez nos conditions d'utilisation</p>
        </div>
      </div>
    </div>
  );
}

export default Register;