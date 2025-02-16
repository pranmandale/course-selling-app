import React from 'react';
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className='bg-gradient-to-r from-green-200 via-cyan-300 to-teal-300 min-h-screen flex flex-col'>
      {/* Header */}
        
      <header className='w-full  mx-auto flex items-center justify-between py-3 px-6 text-white shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500 '>
        <div className='flex items-center space-x-4'>
          <img alt='logo' src={logo} className='w-14 h-14 rounded-full shadow-xl border-2 border-white' />
          <h1 className='text-3xl font-extrabold tracking-wide drop-shadow-md'>UpSkillHub</h1>
        </div>
        <div className='flex space-x-5'>
          <Link to='/login' className='px-5 py-2 border-2 border-white rounded-xl text-white font-semibold hover:bg-white hover:text-emerald-700 transition duration-300 shadow-md'>Login</Link>
          <Link to='/signup' className='px-5 py-2 bg-white text-emerald-700 font-semibold rounded-xl shadow-md hover:bg-gray-200 transition duration-300'>Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className='flex flex-col items-center mt-8 text-center py-24   px-8 flex-grow'>
        <h1 className='text-4xl font-bold text-gray-800'>Welcome to <span className='text-emerald-700'>UpSkillHub</span></h1>
        <p className='text-lg text-gray-700 mt-4 max-w-lg'>Sharpen your skills with courses crafted by experts and take your career to the next level.</p>
        <div className='mt-6 flex space-x-4'>
          <button className='px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:bg-emerald-500 transition duration-300'>Explore Courses</button>
          <button className='px-6 py-3 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-500 hover:text-white transition duration-300'>Course Videos</button>
        </div>
      </section>

      {/* Footer */}

      <footer className='bg-gradient-to-r from-emerald-700 to-teal-600 text-white text-center py-6 mt-10 shadow-lg '>
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
        <p className='mt-4'>&copy; {new Date().getFullYear()} UpSkillHub. All Rights Reserved.</p>
      </footer>
     
    </div>
  );
};

export default Home;
