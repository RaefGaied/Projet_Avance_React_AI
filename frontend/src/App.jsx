import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseAnalysis from "./pages/CourseAnalysis";
import GenerateDescription from "./pages/GenerateDescription";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyReviews from "./pages/MyReviews";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="page-wrapper">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/my-reviews" element={<MyReviews />} />

            {/* Routes protégées pour les fonctionnalités IA */}
            <Route
              path="/courses/:id/analysis"
              element={
                <ProtectedRoute>
                  <CourseAnalysis />
                </ProtectedRoute>
              }
            />

            <Route
              path="/generate-description"
              element={
                <ProtectedRoute>
                  <GenerateDescription />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            {/* Route 404 - Doit être la dernière route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p> {new Date().getFullYear()} Plateforme de Cours en Ligne. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
