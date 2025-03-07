import React, { useState, useRef } from "react";
import logo from "../../assets/logo2.png";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Verification = () => {
    const [otp, setOtp] = useState(new Array(6).fill("")); // 6 digit OTP
    const inputRefs = useRef([]);

    const navigate = useNavigate();``

    const handleChange = (index, e) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
        if (value) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next field if not the last one
            if (index < 5 && inputRefs.current[index + 1]) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            inputRefs.current[index - 1].focus();
        }
    };

    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join(""); // Join the array to form the OTP string

        // Validation to ensure OTP is 6 digits
        if (enteredOtp.length !== 6) {
            toast.error("Please enter a 6-digit OTP.");
            return;
        }

        console.log("Entered OTP:", enteredOtp);

        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/user/otp-verification",
                { otp: enteredOtp }, // Only send OTP
                { withCredentials: true,  }
            );
            toast.success("OTP Verified Successfully!");
            navigate("/")
        } catch (error) {
            console.log("OTP verification error", error);
            toast.error("OTP verification failed.");
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300">
            {/* Header */}
            <header className="w-full flex items-center justify-between py-3 px-6 text-white bg-gradient-to-r from-emerald-600 to-teal-500 shadow-md fixed top-0 left-0 right-0">
                <div className="flex items-center space-x-4">
                    <img src={logo} alt="logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
                    <h1 className="text-2xl font-bold tracking-wide">UpSkillHub</h1>
                </div>
                <div className="flex space-x-4">
                    <Link to="/" className="px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
                        Close
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center mt-20">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-emerald-700">OTP Verification</h2>
                    <p className="text-center text-gray-600 mb-6">Enter the 6-digit code sent to your email</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Inputs */}
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            ))}
                        </div>

                        {/* Verify Button */}
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-500 transition"
                        >
                            Verify
                        </button>
                    </form>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white text-center py-4 w-full shadow-lg fixed bottom-0 left-0 right-0">
                <p>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Verification;
