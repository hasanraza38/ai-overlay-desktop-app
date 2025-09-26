import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await window.electronAPI.getToken();

        console.log("ProtectedRoute: Token check:", token ? "Found" : "Not found" );
         if (token) {
          setIsAuthenticated(true); 
        } else {
          setIsAuthenticated(false);
        }
        
      } catch (error) {
        console.error("ProtectedRoute: Error checking token:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/signup" />;
};



export default ProtectedRoute;