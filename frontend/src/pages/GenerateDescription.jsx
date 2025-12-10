import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function GenerateDescription() {
    const [title, setTitle] = useState('');
    const [instructor, setInstructor] = useState('');
    const [keywords, setKeywords] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!title.trim() || !instructor.trim()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        setDescription('');

        try {
            const response = await api.post('/ai/generate-description', {
                title,
                instructor,
                keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
            });

            setDescription(response.data.data.description);
        } catch (error) {
            console.error('Erreur lors de la génération:', error);
            alert(error.response?.data?.message || 'Erreur lors de la génération');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        alert('Description copiée dans le presse-papier !');
    };

    return (
        <div style={{
            maxWidth: '800px',
            margin: '50px auto',
            padding: '30px',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <h1 style={{
                fontSize: '2rem',
                color: '#f8fafc',
                marginBottom: '10px',
                fontWeight: '600'
            }}>Générer une Description de Cours</h1>

            <p style={{
                color: '#94a3b8',
                marginBottom: '30px',
                fontSize: '1.1rem'
            }}>
                Utilisez l'IA pour créer une description attractive et professionnelle pour votre cours.
            </p>

            <div style={{ marginTop: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#e2e8f0',
                        fontSize: '1rem'
                    }}>
                        Titre du cours <span style={{ color: '#ef4444' }}>*</span>:
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Développement Web avec React"
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            color: '#e2e8f0',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.borderColor = '#334155'}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#e2e8f0',
                        fontSize: '1rem'
                    }}>
                        Instructeur <span style={{ color: '#ef4444' }}>*</span>:
                    </label>
                    <input
                        type="text"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        placeholder="Ex: Dr. Marie Dupont"
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            color: '#e2e8f0',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.borderColor = '#334155'}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: '500',
                        color: '#e2e8f0',
                        fontSize: '1rem'
                    }}>
                        Mots-clés (séparés par des virgules) :
                    </label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Ex: JavaScript, React, Hooks, Frontend"
                        style={{
                            width: '100%',
                            padding: '12px 15px',
                            fontSize: '1rem',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            backgroundColor: '#1e293b',
                            color: '#e2e8f0',
                            transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.borderColor = '#334155'}
                    />
                    <p style={{
                        marginTop: '5px',
                        fontSize: '0.85rem',
                        color: '#94a3b8',
                        fontStyle: 'italic'
                    }}>
                        Ces mots-clés aideront à personnaliser la description générée.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: loading ? '#64748b' : '#8b5cf6',
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
                        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#7c3aed')}
                        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#8b5cf6')}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                <span>Génération en cours...</span>
                            </>
                        ) : (
                            <>
                                <span>Générer avec l'IA</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '12px 25px',
                            backgroundColor: 'transparent',
                            color: '#94a3b8',
                            border: '1px solid #475569',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                            e.target.color = '#e2e8f0';
                        }}
                        onMouseLeave={(e) => {
                            e.target.backgroundColor = 'transparent';
                            e.target.color = '#94a3b8';
                        }}
                    >
                        <span>←</span>
                        <span>Retour</span>
                    </button>
                </div>
            </div>

            {description && (
                <div style={{
                    marginTop: '40px',
                    padding: '25px',
                    backgroundColor: '#1e293b',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    position: 'relative',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                    <button
                        onClick={handleCopy}
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            padding: '8px 16px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.backgroundColor = '#059669'}
                        onMouseLeave={(e) => e.target.backgroundColor = '#10b981'}
                    >
                        <span>📋</span>
                        <span>Copier</span>
                    </button>

                    <h3 style={{
                        color: '#8b5cf6',
                        marginBottom: '20px',
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>📝</span> Description générée :
                    </h3>

                    <div style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        fontSize: '1rem',
                        color: '#e2e8f0',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #2d3748'
                    }}>
                        {description}
                    </div>
                </div>
            )}
        </div>
    );
}

export default GenerateDescription;
