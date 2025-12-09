import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserCourses = async (userId) => {
    if (!userId) return;

    try {
      console.log("Fetching all courses to check user's enrollments...");
      const response = await api.get('/courses');

      const userCourses = response.data.filter(course => {
        if (!course.students) return false;

        return course.students.some(student => {
          if (student && typeof student === 'object' && student._id) {
            return student._id === userId;
          }
          return student === userId;
        });
      });

      console.log("User's enrolled courses:", userCourses);
      setEnrolledCourses(userCourses);
    } catch (error) {
      console.error("Erreur lors du chargement des cours:", error);
      console.error("Error details:", error.response?.data);
      setEnrolledCourses([]);
    }
  };

  // NOUVELLE FONCTION : Récupérer les données complètes de l'utilisateur depuis le serveur
  const fetchUserProfile = async (userId) => {
    if (!userId) return null;
    
    try {
      console.log("Fetching complete user profile from server...");
      const response = await api.get(`/users/${userId}`);
      console.log("Complete user profile:", response.data);
      
      // Mettre à jour l'état avec les données complètes
      setUser(prevUser => {
        const updatedUser = {
          ...prevUser,
          ...response.data,
          // S'assurer que les champs essentiels sont présents
          _id: response.data._id || userId,
          username: response.data.username || prevUser?.username,
          email: response.data.email || prevUser?.email,
          bio: response.data.bio || prevUser?.bio,
          website: response.data.website || prevUser?.website
        };
        console.log("Updated user state:", updatedUser);
        return updatedUser;
      });
      
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const addEnrolledCourse = (course) => {
    console.log("Adding enrolled course:", course);
    setEnrolledCourses(prev => {
      const courseId = typeof course === 'object' ? course._id : course;
      if (prev.some(c => (typeof c === 'object' ? c._id : c) === courseId)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const isEnrolledInCourse = (courseId) => {
    if (!user || !enrolledCourses.length) return false;

    return enrolledCourses.some(course => {
      const currentCourseId = typeof course === 'object' ? course._id : course;
      return currentCourseId === courseId;
    });
  };

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      if (decoded.user) {
        return {
          _id: decoded.user.id || decoded.user._id,
          username: decoded.user.username || decoded.user.email.split('@')[0],
          email: decoded.user.email,
          role: decoded.user.role || 'user'
        };
      }

      return {
        _id: decoded.id || decoded._id || decoded.userId,
        username: decoded.username || decoded.email?.split('@')[0] || 'Utilisateur',
        email: decoded.email,
        role: decoded.role || 'user'
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const userData = decodeToken(token);
        if (userData) {
          console.log("✅ User data from token:", userData);
          setUser(userData);

          if (userData._id) {
            // Récupérer les données complètes depuis le serveur
            fetchUserProfile(userData._id);
            fetchUserCourses(userData._id);
          }
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Error processing token:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        setUser(user);
      }

      return user;
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Une erreur est survenue lors de l'inscription");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);

      const userData = decodeToken(token);
      if (userData) {
        setUser(userData);

        if (userData._id) {
          // Récupérer les données complètes depuis le serveur
          await fetchUserProfile(userData._id);
          await fetchUserCourses(userData._id);
        }
      } else {
        throw new Error("Failed to decode user data from token");
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // VERSION CORRIGÉE : Mise à jour FORCÉE des champs
  const updateUser = (userData) => {
    console.log("updateUser called with:", userData);
    
    setUser(prevUser => {
      if (!prevUser) return userData;
      
      const updatedUser = {
        ...prevUser,
        ...userData,
        // Forcer la mise à jour des champs spécifiques
        username: userData.username !== undefined ? userData.username : prevUser.username,
        email: userData.email !== undefined ? userData.email : prevUser.email,
        bio: userData.bio !== undefined ? userData.bio : prevUser.bio,
        website: userData.website !== undefined ? userData.website : prevUser.website,
        // Toujours conserver l'ID
        _id: prevUser._id
      };
      
      console.log("Updated user in context:", updatedUser);
      return updatedUser;
    });
  };

  // NOUVELLE FONCTION : Mettre à jour le profil sur le serveur
  const updateUserProfile = async (userId, userData) => {
    try {
      console.log("Updating user profile on server:", userId, userData);
      
      const response = await api.put(`/users/${userId}`, userData);
      const updatedUser = response.data.user || response.data;
      
      console.log("Server response:", updatedUser);
      
      // Mettre à jour l'état local avec la réponse du serveur
      updateUser({
        ...updatedUser,
        _id: userId // Garder le même ID
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // NOUVELLE FONCTION : Rafraîchir les données utilisateur depuis le serveur
  const refreshUserData = async () => {
    if (user?._id) {
      try {
        console.log("Refreshing user data from server...");
        const response = await api.get(`/users/${user._id}`);
        const freshData = response.data;
        
        console.log("Fresh user data from server:", freshData);
        
        // Mettre à jour l'état avec les données fraîches
        updateUser(freshData);
        
        return freshData;
      } catch (error) {
        console.error("Error refreshing user data:", error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        enrolledCourses,
        loading,
        register,
        login,
        logout,
        updateUser,
        updateUserProfile, // Ajouté
        refreshUserData, // Ajouté
        fetchUserProfile, // Ajouté
        isAuthenticated: !!user,
        isEnrolledInCourse,
        addEnrolledCourse,
        refreshCourses: () => user?._id && fetchUserCourses(user._id)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
export default AuthContext;