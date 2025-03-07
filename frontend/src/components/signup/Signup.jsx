import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/logo2.png";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("");

  // Password show/hide state
  const [show, setShow] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const changeState = () => setShow(!show);

  const changeStateConfirm = () => setConfirm(!confirm);

  const navigate = useNavigate();

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrorMessage("Password and confirm password do not match!");
    }

    try {
      await axios.post(
        "http://localhost:8000/api/v1/user/signup",
        { firstName, lastName, email, phone, password },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      toast.success("Verification email sent to your email!");
      navigate("/verification");
    } catch (error) {
      if (error.response?.data.message === "User Already exists, login!") {
        toast.error("User already exists. Please login!");
        navigate("/login"); // Redirect to login page
      } else {
        setErrorMessage(error.response?.data.errors || "Signup failed!");
      }
    }
  };


  const handlePhoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Remove non-numeric chars
    if (input.length === 10) input = "+91" + input; // Auto-add country code
    setPhone(input);
  };

  return (
    <div className="bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300 min-h-screen flex flex-col items-center justify-center">
      {/* Header */}
      <header className="w-full flex items-center justify-between py-3 px-6 text-white bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
          <h1 className="text-2xl font-bold tracking-wide">UpSkillHub</h1>
         </div>
        <div className="flex space-x-4"> 
          <Link to="/login" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">Login</Link>
          <Link to="/" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">Close</Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl mt-4">
        <h2 className="text-2xl font-bold text-center text-emerald-700">Join UpSkillHub</h2>
        <p className="text-center text-gray-600 mb-6">Sign up and start learning today!</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="text-gray-700 font-medium">First Name</label>
            <input type="text" value={firstName} placeholder="First Name" onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-gray-700 font-medium">Last Name</label>
            <input type="text" value={lastName} placeholder="Last Name" onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
            <input id="email" type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="text-gray-700 font-medium">Phone</label>
            <input type="text" value={phone} placeholder="+91XXXXXXXXXX" onChange={handlePhoneChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-gray-700 font-medium">Password</label>
            <input type={show ? "text" : "password"} value={password} placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-200"
              onClick={changeState}>
              {show ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative">
            <label className="text-gray-700 font-medium">Confirm Password</label>
            <input type={confirm ? "text" : "password"} value={confirmPassword} placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-200"
              onClick={changeStateConfirm}>
              {confirm ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-center md:col-span-2">{errorMessage}</p>}

          {/* Signup Button */}
          <div className="md:col-span-2">
            <button type="submit" className="w-full font-semibold bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition">
              Sign Up
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-700 to-teal-600 mt-8 text-white text-center py-4 w-full shadow-lg">
        <p>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;
