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

  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        const userData = decodeToken(token);
        if (userData) {
          setUser(userData);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        enrolledCourses,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        addEnrolledCourse,
        isEnrolledInCourse,
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