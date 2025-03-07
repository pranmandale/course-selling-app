// import React, { useEffect, useState } from 'react';
// import logo from "../../assets/logo2.png";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";



// const Home = () => {
//   const [courses, setCourses] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);


//   const handleLogout = async() => {
//     try {
//       const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
//         withCredentials: true,
//       })
//       toast.success("Logout Successful");
//       setIsLoggedIn(false);
//     } catch (error) {
//       console.log("error in logged out ")
//     }
//   }

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/v1/course/get", {
//           withCredentials: true,
//         });
//         setCourses(response.data.courses);
//       } catch (error) {
//         console.log("Error fetching courses", error);
//       }
//     };
//     fetchCourses();
//   }, []);

//   var settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     pauseOnHover: true,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           dots: true,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className='bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300 min-h-screen flex flex-col'>
//       <header className='w-full flex items-center justify-between py-3 px-6 text-white shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500'>
//         <div className='flex items-center space-x-4'>
//           <img alt='logo' src={logo} className='w-14 h-14 rounded-full shadow-lg border-2 border-white' />
//           <h1 className='text-3xl font-extrabold tracking-wide drop-shadow-md'>UpSkillHub</h1>
//         </div>
//         <div className='flex space-x-5'>
//           {/* <Link to='/login' className='px-5 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-emerald-700 transition'>Login</Link>
//           <Link to='/signup' className='px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition'>Sign Up</Link> */}
//           {
//             isLoggedIn ? (
//             <Link to='/login' className='px-5 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-emerald-700 transition'>Logout</Link>
          
//             ): (
//               <>
//                 <Link to = '/login' className = 'px-5 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-emerald-700 transition'>Login</Link>
//               <Link to='/signup' className='px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition'>Sign Up</Link>
//               </>
//             )
//           }
//         </div>
//       </header>

//       <section className='flex flex-col items-center text-center py-12 px-4 md:py-20 md:px-8 flex-grow'>
//         <h1 className='text-4xl font-bold text-gray-800'>Welcome to <span className='text-emerald-700'>UpSkillHub</span></h1>
//         <p className='text-lg text-gray-700 mt-4 max-w-lg'>Sharpen your skills with expert-led courses and take your career to the next level.</p>
//         <div className='mt-6 flex space-x-4'>
//           <button className='px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition'>Explore Courses</button>
//           <button className='px-6 py-3 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-500 hover:text-white transition'>Course Videos</button>
//         </div>
//       </section>

//       <section className='px-6 md:px-12 py-6 '>
//         <Slider {...settings}>
//           {courses.map((course) => (
//             <div key={course._id} className='p-4 '>
//               <div className='relative w-full bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105'>
//                 <img src={course.image?.url} alt={course.title} className='h-20 w-full object-cover' />
//                 <div className='p-4 text-center bg-emerald-200'>
//                   <h2 className='text-xl font-bold text-emerald-700'>{course.title}</h2>
//                   <button className='mt-4 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition'>Enroll Now</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </section>

//       <hr className='border-emerald-500 opacity-75' />

//       <footer className='bg-gradient-to-r from-emerald-700 to-teal-600 mt-8 text-white text-center py-4 shadow-lg'>
//         <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6'>
//           <div className='flex items-center space-x-3'>
//             <img src={logo} alt='logo' className='w-12 h-12 rounded-full border-2 border-white shadow-md' />
//             <h2 className='text-2xl font-bold'>UpSkillHub</h2>
//           </div>
//           <div className='flex space-x-6 mt-4 md:mt-0'>
//             <Link to='/about' className='hover:underline'>About Us</Link>
//             <Link to='/courses' className='hover:underline'>Courses</Link>
//             <Link to='/contact' className='hover:underline'>Contact</Link>
//             <Link to='/faq' className='hover:underline'>FAQ</Link>
//           </div>
//         </div>
//         <p className='mt-4 text-sm'>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Home;




import React, { useEffect, useState } from 'react';
import logo from "../../assets/logo2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    // FIRST we need to store token at localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);


  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", { withCredentials: true });

      // Remove token from localStorage
      localStorage.removeItem("token"); // Ensure the correct key is removed

      // Update state
      setIsLoggedIn(false);
      toast.success("Logout Successful");

      // Redirect to login
      navigate("/login");
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
        console.log("Error fetching courses", error);
      }
    };
    fetchCourses();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, dots: true } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className='bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300 min-h-screen flex flex-col'>
      <header className='w-full flex items-center justify-between py-3 px-6 text-white shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500'>
        <div className='flex items-center space-x-4'>
          <img alt='logo' src={logo} className='w-14 h-14 rounded-full shadow-lg border-2 border-white' />
          <h1 className='text-3xl font-extrabold tracking-wide drop-shadow-md'>UpSkillHub</h1>
        </div>
        <div className='flex space-x-5'>
          {isLoggedIn ? (
            <button onClick={handleLogout} className='px-5 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-emerald-700 transition'>
              Logout
            </button>
          ) : (
            <>
              <Link to='/login' className='px-5 py-2 border-2 border-white rounded-lg hover:bg-white hover:text-emerald-700 transition'>Login</Link>
              <Link to='/signup' className='px-5 py-2 bg-white text-emerald-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition'>Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <section className='flex flex-col items-center text-center py-12 px-4 md:py-20 md:px-8 flex-grow'>
        <h1 className='text-4xl font-bold text-gray-800'>Welcome to <span className='text-emerald-700'>UpSkillHub</span></h1>
        <p className='text-lg text-gray-700 mt-4 max-w-lg'>Sharpen your skills with expert-led courses and take your career to the next level.</p>
        <div className='mt-6 flex space-x-4'>
          <button className='px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition'>Explore Courses</button>
          <button className='px-6 py-3 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-500 hover:text-white transition'>Course Videos</button>
        </div>
      </section>

      <section className='px-6 md:px-12 py-6 '>
        <Slider {...settings}>
          {courses.map((course) => (
            <div key={course._id} className='p-4 '>
              <div className='relative w-full bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105'>
                <img src={course.image?.url} alt={course.title} className='h-20 w-full object-cover' />
                <div className='p-4 text-center bg-emerald-200'>
                  <h2 className='text-xl font-bold text-emerald-700'>{course.title}</h2>
                  <button className='mt-4 px-5 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition'>Enroll Now</button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <hr className='border-emerald-500 opacity-75' />

      <footer className='bg-gradient-to-r from-emerald-700 to-teal-600 mt-8 text-white text-center py-4 shadow-lg'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6'>
          <div className='flex items-center space-x-3'>
            <img src={logo} alt='logo' className='w-12 h-12 rounded-full border-2 border-white shadow-md' />
            <h2 className='text-2xl font-bold'>UpSkillHub</h2>
          </div>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <Link to='/about' className='hover:underline'>About Us</Link>
            <Link to='/courses' className='hover:underline'>Courses</Link>
            <Link to='/contact' className='hover:underline'>Contact</Link>
            <Link to='/faq' className='hover:underline'>FAQ</Link>
          </div>
        </div>
        <p className='mt-4 text-sm'>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;