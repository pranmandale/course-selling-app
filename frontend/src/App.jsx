import React from 'react'
import Home from './components/Home/Home'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import {Routes, Route} from "react-router-dom"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
   </>
  )
}

export default App