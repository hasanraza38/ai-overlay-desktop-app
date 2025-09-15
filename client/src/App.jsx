import React from 'react'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Wellcome from './pages/Wellcome'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (

    <>

      <Routes>
        <Route path="/" element={  <Wellcome />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </>

    // /api/v1/auth/login
  )
}
