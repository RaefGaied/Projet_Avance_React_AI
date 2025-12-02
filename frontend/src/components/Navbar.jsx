import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "0 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        height: "70px",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
      {/* LEFT SIDE - LOGO & NAVIGATION */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "30px",
        flex: "1"
      }}>
        {/* LOGO */}
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            minWidth: "180px",
          }}
        >
          <span style={{
            background: "rgba(255, 255, 255, 0.2)",
            padding: "8px 12px",
            borderRadius: "8px",
            backdropFilter: "blur(5px)",
            fontSize: "20px"
          }}>
            🚀
          </span>
          <span style={{ letterSpacing: "-0.5px", whiteSpace: "nowrap" }}>LearnSphere</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div style={{
          display: "flex",
          gap: "25px",
          justifyContent: "center",
          flex: "1"
        }}>
          <Link
            to="/"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
              padding: "8px 0",
              position: "relative",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "white";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "rgba(255, 255, 255, 0.9)";
              e.target.style.transform = "translateY(0)";
            }}
            onMouseEnter={(e) => {
              const underline = e.target.querySelector('span');
              if (underline) underline.style.width = "100%";
            }}
            onMouseLeave={(e) => {
              const underline = e.target.querySelector('span');
              if (underline) underline.style.width = "0";
            }}
          >
            Accueil
            <span style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "0",
              height: "2px",
              background: "white",
              transition: "width 0.3s ease",
            }} />
          </Link>

          <Link
            to="/courses"
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
              padding: "8px 0",
              position: "relative",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
            onMouseOver={(e) => {
              e.target.style.color = "white";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.target.style.color = "rgba(255, 255, 255, 0.9)";
              e.target.style.transform = "translateY(0)";
            }}
            onMouseEnter={(e) => {
              const underline = e.target.querySelector('span');
              if (underline) underline.style.width = "100%";
            }}
            onMouseLeave={(e) => {
              const underline = e.target.querySelector('span');
              if (underline) underline.style.width = "0";
            }}
          >
            Cours
            <span style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              width: "0",
              height: "2px",
              background: "white",
              transition: "width 0.3s ease",
            }} />
          </Link>

          {/* LIEN "MES AVIS" - SEULEMENT POUR LES UTILISATEURS CONNECTÉS */}
          {isAuthenticated && (
            <Link
              to="/my-reviews"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "15px",
                padding: "8px 0",
                position: "relative",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.color = "rgba(255, 255, 255, 0.9)";
                e.target.style.transform = "translateY(0)";
              }}
              onMouseEnter={(e) => {
                const underline = e.target.querySelector('span');
                if (underline) underline.style.width = "100%";
              }}
              onMouseLeave={(e) => {
                const underline = e.target.querySelector('span');
                if (underline) underline.style.width = "0";
              }}
            >
              Mes Avis
              <span style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "0",
                height: "2px",
                background: "white",
                transition: "width 0.3s ease",
              }} />
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - USER ACTIONS */}
      <div style={{
        display: "flex",
        gap: "15px",
        alignItems: "center",
        justifyContent: "flex-end",
        minWidth: "200px"
      }}>
        {isAuthenticated ? (
          <>
            {/* USER PROFILE - CLICKABLE */}
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255, 255, 255, 0.15)",
                padding: "6px 12px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
                fontSize: "13px",
              }}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{
                  color: "white",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "13px",
                }}>
                  {user?.username || "Utilisateur"}
                </span>
                <span style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontWeight: "400",
                  fontSize: "11px",
                  transition: "all 0.2s ease",
                }}>
                  Mon profil
                </span>
              </div>
            </Link>

            {/* LOGOUT BUTTON */}
            <button
              onClick={logout}
              style={{
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "14px" }}>🚪</span>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* LOGIN LINK */}
            <Link
              to="/login"
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(5px)",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.color = "rgba(255, 255, 255, 0.9)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Connexion
            </Link>

            {/* REGISTER BUTTON */}
            <Link
              to="/register"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                padding: "8px 18px",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)",
                whiteSpace: "nowrap",
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(76, 175, 80, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(76, 175, 80, 0.3)";
              }}
            >
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;