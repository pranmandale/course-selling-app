
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiMenu, HiX } from "react-icons/hi";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Purchased = () => {
  const [purchases, setPurchases] = useState([]); // Ensuring it's always an array
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true });
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      toast.success("Logout Successful");
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
      toast.error("Logout failed, try again.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPurchasedCourses = async () => {
      if (!token) {
        setErrorMessage("Please login to view purchases!");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/v1/user/purchases", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setPurchases(Array.isArray(response.data.courseData) ? response.data.courseData : []); // Ensures it's always an array
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "Failed to fetch purchase data");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-green-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}>
        <button className="md:hidden absolute top-4 right-4 text-2xl" onClick={toggleSidebar}>
          <HiX />
        </button>

        <div className="flex items-center gap-3 mb-10">
          <CgProfile className="text-3xl" />
          <span className="text-xl font-semibold">Welcome</span>
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                <RiHome2Fill className="mr-3" /> Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                <FaDiscourse className="mr-3" /> Courses
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center p-3 rounded-lg bg-blue-500 text-white">
                <FaDownload className="mr-3" /> Purchases
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                <IoMdSettings className="mr-3" /> Settings
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <Link to="/" className="flex items-center p-3 rounded-lg text-red-500 hover:bg-gray-200" onClick={handleLogout}>
                  <IoLogOut className="mr-3" /> Logout
                </Link>
              ) : (
                <Link to="/login" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
                  <IoLogIn className="mr-3" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Purchased Courses</h1>
        </header>

        {/* Purchased Courses List */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center col-span-full text-gray-500">Loading...</p>
          ) : errorMessage ? (
            <p className="text-center col-span-full text-red-500">{errorMessage}</p>
          ) : Array.isArray(purchases) && purchases.length === 0 ? (
            <p className="text-center col-span-full text-gray-500 text-lg font-semibold">
              You have not purchased any courses yet. Explore our{" "}
              <Link to="/courses" className="text-blue-600 hover:underline">
                courses
              </Link>
              .
            </p>
          ) : (
            purchases.map((course) => (
              <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <img src={course.image?.url || "default-image.jpg"} alt={course.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-bold">{course.title}</h2>
                  <p className="text-gray-600 text-sm">{course.description?.slice(0, 80)}...</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-xl text-gray-900">₹{course.price}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Purchased;
