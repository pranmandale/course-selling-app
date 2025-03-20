import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiMenu, HiX } from "react-icons/hi";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload, FaCircleUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/course/get", {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses", error);
        toast.error("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex  min-h-scree bg-green-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}>
        <button className="md:hidden absolute top-4 right-4 text-2xl" onClick={toggleSidebar}>
          <HiX />
        </button>

        

        <div className="flex items-center gap-3 mb-10">
          <div className="flex items-center">
            <CgProfile className="text-3xl" />
          </div>
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
              <Link to="#" className="flex items-center p-3 rounded-lg bg-blue-500 text-white">
                <FaDiscourse className="mr-3" /> Courses
              </Link>
            </li>
            <li>
              <Link to="/purchased" className="flex items-center p-3 rounded-lg hover:bg-gray-200">
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
          <h1 className="text-2xl font-bold">Explore Our Courses</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="border border-gray-300 rounded-full pl-4 pr-10 py-2 focus:outline-none"
              />
              <FiSearch className="absolute top-2 right-3 text-gray-500" />
            </div>
            <FaCircleUser className="text-3xl text-blue-500" />
          </div>
        </header>

        {/* Courses List */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center col-span-full text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No courses available</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <img src={course.image?.url || "default-image.jpg"} alt={course.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-bold">{course.title}</h2>
                  <p className="text-gray-600 text-sm">{course.description?.slice(0, 80)}...</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-xl text-gray-900">₹{course.price}</span>
                    <Link to={`/buy/${course._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Buy Now
                    </Link>
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

export default Courses;
