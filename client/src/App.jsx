// import React from 'react'
// import ChatSection from './pages/ChatSection'
// import Signup from './pages/Signup'
// import Signin from './pages/Signin'
// import Wellcome from './pages/Wellcome'
// import { Route, Routes } from 'react-router-dom'
// import Chatbot from './pages/ChatSection'
// import ProtectedRoute from './components/ProtectedRoute'

// export default function App() {

//   return (

//     <>
//       <Routes> 
//         <Route path="/" element={  <Wellcome />} />
//         <Route path="/signup" element={ <Signup />} />
//         <Route path="/signin" element={<Signin />} />

//         <Route
//           path="/chatbot"
//           element={
//             <ProtectedRoute>
//                <ChatSection />
//             </ProtectedRoute>
//           }
//         />

//       </Routes>
//     </>

//   )
// }
// change topbar like cortex
// dark mood add in app
// app resiable after login signup
// add copy icone in chat code code section




import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ChatSection from "./pages/ChatSection";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await window.electronAPI.getToken();
      setIsAuthenticated(!!token);
      setAuthChecked(true);
    };
    checkToken();
  }, []);

  if (!authChecked) return <div>Loading...</div>; // wait until token fetch

  return (
   
      <Routes>
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <ChatSection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signin />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signup />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/chatbot" /> : <Navigate to="/signin" />}
        />
      </Routes>
    
  );
}

export default App;


// change topbar like cortex
// dark mood add in app
// app resiable after login signup
// add copy icone in chat code code section
