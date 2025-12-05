import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            maxWidth: '600px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{
                fontSize: '120px',
                margin: '0',
                color: '#4CAF50',
                fontWeight: 'bold',
                lineHeight: '1'
            }}>404</h1>

            <h2 style={{
                fontSize: '32px',
                margin: '20px 0 15px',
                color: '#2c3e50'
            }}>Page non trouvée</h2>

            <p style={{
                margin: '0 0 30px',
                fontSize: '18px',
                color: '#7f8c8d',
                lineHeight: '1.6'
            }}>
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>

            <div style={{ marginTop: '30px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '12px 30px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#45a049';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#4CAF50';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                >
                    Retour à l'accueil
                </button>

                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            padding: '8px 20px',
                            backgroundColor: 'transparent',
                            color: '#4CAF50',
                            border: '1px solid #4CAF50',
                            borderRadius: '4px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.backgroundColor = '#f5f5f5';
                        }}
                        onMouseOut={(e) => {
                            e.target.backgroundColor = 'transparent';
                        }}
                    >
                        ← Page précédente
                    </button>
                </div>
            </div>

            <div style={{
                marginTop: '50px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#6c757d'
            }}>
                <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support technique.</p>
            </div>
        </div>
    );
}

export default NotFound;
