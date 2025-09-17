import React from 'react'
import ChatSection from './pages/ChatSection'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Wellcome from './pages/Wellcome'
import { Route, Routes } from 'react-router-dom'
import Chatbot from './pages/ChatSection'

export default function App() {
  return (

    <>
      <Routes> 
        <Route path="/" element={  <Wellcome />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </>


// electron-tar
  )
}
