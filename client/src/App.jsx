// import React, { useEffect, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from './components/ProtectedRoute';
// import Signin from "./pages/Signin";
// import Signup from "./pages/Signup";
// import ChatSection from "./pages/ChatSection";
// import PricingPage from "./pages/Plane";
// import Wellcome from "./pages/Wellcome";

// function App() {
//   const [authChecked, setAuthChecked] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isFirstTime, setIsFirstTime] = useState(false);

//   // useEffect(() => {
//   //   const checkToken = async () => {
//   //     let token = await window.electronAPI.getToken();
//   //     // token = null

//   //     if (token) {
//   //       setIsAuthenticated(true);   // Token exists → authenticated
//   //       setAuthChecked(true);
//   //     } else {
//   //       setIsAuthenticated(false);  // Token not exists → not authenticated
//   //       setAuthChecked(true);
//   //     }
//   //   };
//   //   checkToken();
//   // }, []);


//   // for first time user experience
//   useEffect(() => {
//     const initializeApp = async () => {

//       // Check token
//       let token = await window.electronAPI.getToken();
//       if (token) {
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }

//       setAuthChecked(true);
//     };

//     initializeApp();
//   }, []);



//  const handleContinue = () => {
//     setIsFirstTime(false); // Continue se Welcome page hide ho jaye
//   };

//    if (!authChecked) return null;

//   if (isFirstTime || !isAuthenticated) {
//     return <Wellcome onContinue={handleContinue} />;
//   }

//   return (

//     <Routes>
//       <Route path="/chatbot" element={<ProtectedRoute> <ChatSection /></ProtectedRoute>} />
//       <Route path="/signin" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signin />} />
//       <Route path="/signup" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />

//       {/* Default route */}
//       <Route path="/" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Navigate to="/signup" />} />

//     </Routes>

//   );
// }

// export default App;



import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ChatSection from "./pages/ChatSection";
import PricingPage from "./pages/Plane";
import Wellcome from "./pages/Wellcome";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Check token from Electron
      let token = await window.electronAPI.getToken();
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setAuthChecked(true);
    };

    initializeApp();
  }, []);

  if (!authChecked) return null; // wait for token check

  // Agar token nahi hai → show Welcome page

  // Token hai → normal routes
  return (


    <Routes>

      {!isAuthenticated && (
        <Route path="/" element={<Wellcome />} />
      )}
      <Route path="/chatbot" element={<ProtectedRoute><ChatSection /></ProtectedRoute>} />
      <Route path="/signin" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signin />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Signup setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/chatbot" /> : <Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;

