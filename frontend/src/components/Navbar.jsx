import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Accueil
        </Link>
        <Link to="/courses" style={{ color: 'white', textDecoration: 'none' }}>
          Cours
        </Link>
        {isAuthenticated && (
          <Link to="/my-reviews" style={{ color: 'white', textDecoration: 'none' }}>
            Mes Avis
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none' }}>
              Profil ({user?.username})
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Connexion
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;