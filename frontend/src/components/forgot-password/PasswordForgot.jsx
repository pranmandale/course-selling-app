import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/logo2.png";

function PasswordForgot() {

  const [email, setEmail] = useState("");


  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("", { email }, { withCredentials: true, })
      
      toast.success("Reset Password link is sent to Your Email!");
    } catch (error) {
      console.log("error in forgot password", error);
    }
    console.log("Submitting:", { email });

   
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300">
      {/* Header - Fixed at the top */}
      <header className="w-full flex items-center justify-between py-3 px-6 text-white bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md fixed top-0 left-0 right-0">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
          <h1 className="text-2xl font-bold tracking-wide">UpSkillHub</h1>
        </div>
        <div className="flex space-x-4">
          <Link to="/login" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">Login</Link>
          <Link to="/" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">Close</Link>
        </div>
      </header>

      {/* Main Content - Pushes footer down */}
      <main className="flex-grow flex flex-col items-center justify-center mt-20">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-emerald-700">Join UpSkillHub</h2>
          <p className="text-center text-gray-600 mb-6 underline">Forgot Password!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-700 font-medium">Enter Your Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                
                required
              />
            </div>

            
            {/* {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>} */}

            <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition">
              Submit
            </button>
          </form>
        </div>
      </main>

      {/* Footer - Fixed at the bottom */}
      <footer className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white text-center py-4 w-full shadow-lg fixed bottom-0 left-0 right-0">
        <p>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
      </footer>
    </div>
  );

}

export default PasswordForgot;
