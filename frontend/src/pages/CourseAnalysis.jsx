import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function CourseAnalysis() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                console.error('Error fetching course:', err);
                navigate('/not-found', { replace: true });
            }
        };

        fetchCourse();
    }, [id, navigate]);

    const handleAnalyze = async () => {
        setLoading(true);
        setError('');
        setAnalysis(null);

        try {
            const response = await api.post(`/ai/analyze-reviews/${id}`);
            setAnalysis(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'analyse');
        } finally {
            setLoading(false);
        }
    };

    const formatAnalysis = (text) => {
        if (!text) return null;

        return text
            .split('\n')
            .map((line, index) => {
                if (line.startsWith('## ')) {
                    return (
                        <h3
                            key={index}
                            style={{
                                marginTop: '25px',
                                color: '#2c3e50',
                                borderBottom: '2px solid #3498db',
                                paddingBottom: '10px'
                            }}
                        >
                            {line.replace('## ', '')}
                        </h3>
                    );
                } else if (line.match(/^\d+\./)) {
                    return (
                        <li
                            key={index}
                            style={{
                                marginLeft: '20px',
                                lineHeight: '1.8'
                            }}
                        >
                            {line.replace(/^\d+\./, '')}
                        </li>
                    );
                } else if (line.trim()) {
                    return (
                        <p
                            key={index}
                            style={{
                                lineHeight: '1.8',
                                marginTop: '10px'
                            }}
                        >
                            {line}
                        </p>
                    );
                }
                return null;
            });
    };

    if (!course) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                Chargement...
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '50px auto',
            padding: '30px'
        }}>
            <h1>Analyse IA des Reviews</h1>
            <h2 style={{ color: '#666', marginTop: '10px' }}>{course.title}</h2>

            <div style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px'
            }}>
                <p><strong>Instructeur :</strong> {course.instructor}</p>
                <p><strong>Étudiants inscrits :</strong> {course.students?.length || 0}</p>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={loading}
                style={{
                    marginTop: '30px',
                    padding: '15px 40px',
                    backgroundColor: loading ? '#95a5a6' : '#9b59b6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}
            >
                {loading ? 'Analyse en cours...' : 'Analyser avec l\'IA'}
            </button>

            {error && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )}

            {analysis && (
                <div style={{
                    marginTop: '40px',
                    padding: '30px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <h2 style={{ color: '#9b59b6', margin: 0 }}>
                            Rapport d'Analyse IA
                        </h2>
                        <span style={{
                            padding: '8px 16px',
                            backgroundColor: '#e8f5e9',
                            color: '#27ae60',
                            borderRadius: '20px',
                            fontWeight: 'bold'
                        }}>
                            {analysis.reviewCount} reviews analysées
                        </span>
                    </div>

                    <div style={{ fontSize: '16px' }}>
                        {formatAnalysis(analysis.analysis)}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseAnalysis;
