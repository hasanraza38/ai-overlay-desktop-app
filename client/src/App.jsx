import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ChatSection from "./pages/ChatSection";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      let token = await window.electronAPI.getToken();
      // token = null

      if (token) {
        setIsAuthenticated(true);   // Token exists → authenticated
        setAuthChecked(true);
      } else {
        setIsAuthenticated(false);  // Token not exists → not authenticated
        setAuthChecked(true);
      }
    };
    checkToken();
  }, []);


  // for first time user experience
  useEffect(() => {
    const initializeApp = async () => {
      const firstTimeFlag = localStorage.getItem("firstTimeUser"); // null = first time
      if (!firstTimeFlag) {
        setIsFirstTime(true);
        localStorage.setItem("firstTimeUser", "false"); 
      }

      // 2️⃣ Check auth token
      let token = await window.electronAPI.getToken();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      // ✅ Done with checks
      setAuthChecked(true);
    };

    initializeApp();
  }, []);



// for user first time come at app 
  //  useEffect(() => {
  //   const initializeApp = async () => {
  //     // ✅ First-time check
  //     const firstTimeFlag = localStorage.getItem("firstTimeUser");
  //     if (!firstTimeFlag) {
  //       setIsFirstTime(true);
  //       localStorage.setItem("firstTimeUser", "false");
  //     }

  //     // ✅ Token check
  //     let token = await window.electronAPI.getToken();
  //     setIsAuthenticated(!!token);

  //     // ✅ Done with all checks
  //     setAuthChecked(true);
  //   };

  //   initializeApp();
  // }, []);

  if (!authChecked) return <div>Loading...</div>; // wait until token fetch

  return (

    <Routes>

      <Route path="/chatbot" element={<ProtectedRoute> <ChatSection /></ProtectedRoute>} />
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signin />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />


      {/* Default route */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Navigate to="/signup" />} />
    </Routes>


  );
}

export default App;




// change topbar like cortex
// dark mood add in app
// app resiable after login signup
// add copy icone in chat code code section

