import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/EditProfile.css';

function EditProfile() {
    const { user, updateUserProfile, refreshUserData } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            console.log("User data loaded in EditProfile:", user);
            setFormData({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                website: user.website || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!user?._id) {
                throw new Error("Utilisateur non identifié");
            }

            console.log("Updating profile for user:", user._id);
            console.log("Form data:", formData);
            
            // Utiliser la fonction updateUserProfile du contexte
            const updatedUser = await updateUserProfile(user._id, formData);
            
            console.log("Profile updated successfully:", updatedUser);
            
            setSuccess('✅ Profil mis à jour avec succès!');
            
            // Rafraîchir les données pour s'assurer qu'elles sont synchronisées
            await refreshUserData();
            
            // Rediriger après 2 secondes
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
            
        } catch (error) {
            console.error("Update error:", error);
            setError(error.response?.data?.message || error.message || 'Une erreur est survenue lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-card">
                <h1>Modifier le profil</h1>
                
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom d'utilisateur:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Bio:</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Dites-nous en plus sur vous..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Site web:</label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="https://example.com"
                        />
                        <small className="form-help">
                            Laissez ce champ vide si vous ne souhaitez pas afficher de site web.
                        </small>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="btn btn-outline"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;