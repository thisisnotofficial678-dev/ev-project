import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
// import StationsGrid from "./components/StationsGrid";
import MapSection from "./components/MapSection";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import IntroForm from "./components/IntroForm";
import { useAuth } from "./context/AuthContext";
import { useIntroForm } from "./context/IntroFormContext";

const App: React.FC = () => {
  const { user } = useAuth();
  const { hasCompletedIntro, setFormData, setHasCompletedIntro } = useIntroForm();
  const [showIntroForm, setShowIntroForm] = useState(false);

  useEffect(() => {
    // Show intro form only on home page if user hasn't completed it
    if (!hasCompletedIntro && window.location.pathname === '/') {
      setShowIntroForm(true);
    }
  }, [hasCompletedIntro]);

  const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!user) {
      return <LoginPage />;
    }
    return <>{children}</>;
  };

  const handleIntroComplete = (formData: any) => {
    setFormData(formData);
    setHasCompletedIntro(true);
    setShowIntroForm(false);
  };

  return (
    <div className="font-sans">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              {showIntroForm ? (
                <IntroForm onComplete={handleIntroComplete} />
              ) : (
                <>
                  <Hero />
                  <Features />
                  <MapSection />
                </>
              )}
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
