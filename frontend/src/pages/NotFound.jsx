import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHome } from 'react-icons/fa';
import '../assets/NotFound.css';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-illustration">
                    <div className="not-found-404">404</div>
                    <div className="not-found-astronaut">🚀</div>
                </div>

                <h1 className="not-found-title">Oups ! Page introuvable</h1>

                <p className="not-found-message">
                    La page que vous recherchez semble avoir été déplacée, supprimée ou n'a jamais existé.
                </p>

                <div className="not-found-actions">
                    <button
                        onClick={() => navigate(-1)}
                        className="not-found-button back-button"
                    >
                        <FaArrowLeft className="button-icon" />
                        Retour
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="not-found-button home-button"
                    >
                        <FaHome className="button-icon" />
                        Retour à l'accueil
                    </button>
                </div>

                <div className="not-found-error-code">
                    <p>Code d'erreur: 404 | Page non trouvée</p>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
