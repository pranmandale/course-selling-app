import React from 'react'
import Home from './components/Home/Home'
import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from './context/protectedRoute/ProtectedRoute'
import About from './components/about/About'
import Faq from './components/FAQ/Faq'
import { Toaster } from "react-hot-toast"
import Verification from './components/verification/Verification'
import PasswordForgot from './components/forgot-password/PasswordForgot'
import ResetPassword from './components/resetPassword/ResetPassword'

const App = () => {
  return (
    <>
      <Toaster position='top-center reverseOrder={false}'></Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/about' element={
          <ProtectedRoute>
            <About/>
        </ProtectedRoute>
        } />
        <Route path='/faq' element={ 
          <ProtectedRoute>
            <Faq/>
          </ProtectedRoute>
        } />
        <Route path='/verification' element={<Verification />} />
        <Route path='/forgot-password' element={<PasswordForgot />} />
        <Route path='/reset-password' element={ <ResetPassword/>} />
      </Routes>
   </>
  )
}

export default App