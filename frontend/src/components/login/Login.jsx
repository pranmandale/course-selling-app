import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/logo2.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);

  const navigate = useNavigate();

  const changeState = () => setShow(!show);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        { email, password },
        { withCredentials: true }
      );

      // Store the token in localStorage
      // this token is come from backend response
      localStorage.setItem("token", response.data.token);
      toast.success("Login Successful!");
      navigate("/");
    } catch (error) {
      toast.error("Login Failed!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300">
      <header className="w-full flex items-center justify-between py-3 px-6 text-white bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
          <h1 className="text-2xl font-bold tracking-wide">UpSkillHub</h1>
        </div>
        <div className="flex space-x-4">
          <Link to="/signup" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">Sign Up</Link>
          <Link to="/" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">Close</Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center mt-20">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-emerald-700">Join UpSkillHub</h2>
          <p className="text-center text-gray-600 mb-6">Log In and start learning today!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="relative">
              <label className="text-gray-700 font-medium">Password</label>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Password"
                required
              />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-200"
                onClick={changeState}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-emerald-700 hover:underline">Forgot Password?</Link>
            </div>

            {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

            <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-500 transition">
              Login
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white text-center py-4 w-full shadow-lg fixed bottom-0 left-0 right-0">
        <p>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
