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
          setIsAuthenticated(true);   // Token exists → authenticated
        } else {
          setIsAuthenticated(false);  // Token not exists → not authenticated
        }
        
      } catch (error) {
        console.error("ProtectedRoute: Error checking token:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking token
  }

  return isAuthenticated ? children : <Navigate to="/signup" />;
};



export default ProtectedRoute;




// keytar k through store wo hogayya khi save ..
// protected route component ka ye kaam ha k  get token jo phele se store ha ahar ha token tou chat sctren pe le jaye ga ..agar nhi ha tou login pahge pr le jsye ga aur nhi ayega 