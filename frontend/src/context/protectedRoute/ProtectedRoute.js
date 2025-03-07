import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    
    // const isAuthenticated = false;
    const isAuthenticated = localStorage.getItem("token") ? true : false;

    const navigate = useNavigate();

    useEffect(() => {
        // if isAuthenticated is false the it will redirect to /login
      if (!isAuthenticated) {
          toast.error("Please login to continue");
            navigate("/login");
        }
    }, [])
  return (
    children
  )
}

export default ProtectedRoute