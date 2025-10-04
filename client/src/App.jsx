import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ChatSection from "./pages/ChatSection";
import Wellcome from "./pages/Wellcome";
import SettingsPage from "./pages/SettingsPage";
import Pricingplan from "./pages/PricingPlan";


function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      const token = await window.electronAPI.getToken();
      console.log("Token from preload:", token);
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setAuthChecked(true);
    };

    initializeApp();
  }, []);

  if (!authChecked) return null;

  return (


    <Routes>

      {!isAuthenticated && (
        <Route path="/" element={<Wellcome />} />
      )}
      <Route path="/chatbot" element={<ProtectedRoute><ChatSection /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signin />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />

      <Route path="/" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Navigate to="/signup" />} />

      <Route path="/pricingplan" element={<Pricingplan />} />

    </Routes>
  );
}

export default App;

