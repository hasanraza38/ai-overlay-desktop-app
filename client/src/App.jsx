import React from 'react'

import ChatSection from './pages/ChatSection'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Wellcome from './pages/Wellcome'
import { Route, Routes } from 'react-router-dom'
import Topbar from './components/Topbar'

export default function App() {
  return (

    <>
      {/* <ChatSection/> */}
  

      <Routes>
        <Topbar/>
        <Route path="/" element={  <Wellcome />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </>


// electron-tar
  )
}
