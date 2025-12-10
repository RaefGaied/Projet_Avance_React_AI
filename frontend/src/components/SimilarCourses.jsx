import { useState } from 'react';
import api from '../api/axios';

function SimilarCourses({ courseId }) {
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleGetSuggestions = async () => {
        if (suggestions) {
            setShow(!show);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/ai/similar-courses/${courseId}`);
            setSuggestions(response.data.data);
            setShow(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions:', error);
            alert(error.response?.data?.message || 'Erreur lors de la génération des suggestions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <button
                onClick={handleGetSuggestions}
                disabled={loading}
                style={{
                    padding: '12px 24px',
                    backgroundColor: loading ? '#64748b' : '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.8 : 1
                }}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#d97706')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#f59e0b')}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        <span>Chargement...</span>
                    </>
                ) : show ? (
                    <>
                        <span>Masquer les suggestions</span>
                    </>
                ) : (
                    <>
                        <span>🔍</span>
                        <span>Voir les cours similaires (IA)</span>
                    </>
                )}
            </button>

            {show && suggestions && (
                <div style={{
                    marginTop: '25px',
                    padding: '25px',
                    backgroundColor: '#1e293b',
                    borderRadius: '10px',
                    border: '1px solid #3b82f6',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        color: '#f59e0b',
                        marginBottom: '20px',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span>✨</span>
                        Cours similaires recommandés par l'IA :
                    </h3>

                    <div style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        fontSize: '1rem',
                        color: '#e2e8f0',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #2d3748'
                    }}>
                        {suggestions.suggestions}
                    </div>

                    <p style={{
                        marginTop: '15px',
                        fontSize: '0.9rem',
                        color: '#94a3b8',
                        fontStyle: 'italic'
                    }}>
                        Ces suggestions sont générées par notre IA en fonction du contenu du cours actuel.
                    </p>
                </div>
            )}
        </div>
    );
}

export default SimilarCourses;
