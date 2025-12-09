import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: '#1e293b',
      borderRadius: '10px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      color: '#e2e8f0'
    }}>
      <h2 style={{
        marginTop: 0,
        color: '#f8fafc',
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        Connexion
      </h2>

      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#7f1d1d',
          color: '#fecaca',
          borderRadius: '6px',
          fontSize: '14px',
          borderLeft: '4px solid #ef4444'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#94a3b8',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              boxSizing: 'border-box',
              color: '#f8fafc',
              fontSize: '14px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.borderColor = '#60a5fa';
              e.target.boxShadow = '0 0 0 3px rgba(96, 165, 250, 0.2)';
            }}
            onBlur={(e) => {
              e.target.borderColor = '#475569';
              e.target.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <label style={{
              color: '#94a3b8',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Mot de passe
            </label>
            <Link
              to="/forgot-password"
              style={{
                color: '#60a5fa',
                fontSize: '13px',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.color = '#93c5fd'}
              onMouseOut={(e) => e.target.style.color = '#60a5fa'}
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#334155',
              border: '1px solid #475569',
              borderRadius: '6px',
              boxSizing: 'border-box',
              color: '#f8fafc',
              fontSize: '14px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.borderColor = '#60a5fa';
              e.target.boxShadow = '0 0 0 3px rgba(96, 165, 250, 0.2)';
            }}
            onBlur={(e) => {
              e.target.borderColor = '#475569';
              e.target.boxShadow = 'none';
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '500',
            marginBottom: '20px',
            transition: 'background-color 0.2s, transform 0.1s',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          Se connecter
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        paddingTop: '15px',
        borderTop: '1px solid #334155',
        marginTop: '15px'
      }}>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Pas encore de compte ? </span>
        <Link
          to="/register"
          style={{
            color: '#60a5fa',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.color = '#93c5fd'}
          onMouseOut={(e) => e.target.style.color = '#60a5fa'}
        >
          S'inscrire
        </Link>
      </div>
    </div>
  );
}

export default Login;