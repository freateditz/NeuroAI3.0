import Mic from "../assets/Mic.png";
import Engaging from "../assets/engaging_interface.png";
import Progress from "../assets/progress_tracking.png";
import Phonic from "../assets/holistic_phonic_training.png";
import Motor from "../assets/motor_based.png";
import Visual from "../assets/visual_auditory_stimulation.png";
import Learning from "../assets/multimodal_learning.png";
import RealTIme from "../assets/RealTIme.png";
import Dimensional from "../assets/threeDimensional.png";
import Illustration from "../assets/Illustration.png";
import Contact from "../assets/Contact Us.png";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import AuthModal from "../Components/AuthModal";
import { API_URL } from "../url/base";

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Contact form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const getstarted = () => {
    if (isAuthenticated) {
      navigate("/learning");
    } else {
      setIsAuthModalOpen(true);
    }
  };
  const mySectionRef = useRef(null);
  const scrollToSection = () => {
    mySectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Show success notification
        setNotification({
          show: true,
          message: 'Message sent successfully!',
          type: 'success'
        });

        // Clear form fields
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          message: ''
        });

        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
      } else {
        setNotification({
          show: true,
          message: data.message || 'Failed to send message',
          type: 'error'
        });
        setTimeout(() => {
          setNotification({ show: false, message: '', type: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({
        show: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-spacegroteskmedium animate-slide-in`}>
          {notification.message}
        </div>
      )}
      
      <div className="lg:grid-cols-2 grid grid-cols-1">
        <div className="flex flex-col lg:pl-20 justify-center">
          <div>
            <div className="lg:text-6xl md:text-4xl sm:text-3xl text-2xl lg:text-left text-center flex flex-col gap-4 font-spacegrotesksemibold dark:text-white">
              <div>
                Speak.<span className="text-[#2D8CFF]"> Learn</span>. Thrive
              </div>
              <div>Bridging the gap with</div>
              <div>every word</div>
            </div>
            <div className="lg:hidden flex justify-center mt-10">
              <img src={Mic} />
            </div>
            <div className="lg:text-xl md:text-xl text-lg font-spacegroteskregular my-10 text-center lg:text-start p-1 lg:p-0 dark:text-gray-300">
              Our goal is to empower individuals with speech challenges. Unlock
              your potential through personalized speech training.
            </div>
          </div>

          <div className="flex flex-col lg:flex-row sm:flex-row lg:justify-start gap-8 sm:justify-center">
            <div onClick={getstarted} className="flex justify-center">
              <button className="border rounded-md font-spacegroteskmedium flex items-center justify-center px-12 py-4 bg-[#89D85D] text-black hover:bg-opacity-70 border-black">
                <p>Get Started</p>
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={scrollToSection} className="border flex font-spacegroteskmedium items-center justify-center rounded-md px-7 py-4 border-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                <p>Browse Features</p>
              </button>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center">
          <img src={Mic} />
        </div>
      </div>

      <div ref={mySectionRef}>
        <div className="flex items-center justify-center lg:block">
          <div id="features" className="border-y-4 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            Features
          </div>
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-center gap-8 p-10">
            <div className="bg-[#2D8CFF] rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 sm:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img
                  src={Engaging}
                  alt="arrows"
                  className="lg:h-24 md:h-24 h-14"
                />
              </div>
              <div className="font-spacegrotesksemibold lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start text-white mb-2">
                Engaging Interfacing
              </div>
              <div className="text-white font-spacegrotesklight text-center lg:text-start md:text-start">
                Interactive sessions for an immersive learning experience.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img
                  src={Progress}
                  alt=""
                  className="mb-4 lg:h-20 md:h-20 h-14"
                />
              </div>
              <div className="font-spacegrotesksemibold mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start dark:text-white">
                Progress Tracking
              </div>
              <div className="font-spacegrotesklight text-center lg:text-start md:text-start dark:text-gray-300">
                Track success, analyze and celebrate milestone.
              </div>
            </div>

            <div className="bg-[#2D8CFF] rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img src={Phonic} alt="" className="lg:h-24 md:h-24 h-14" />
              </div>
              <div className="font-spacegrotesksemibold text-white mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start">
                Holistic Phonics Training
              </div>
              <div className="font-spacegrotesklight text-center lg:text-start md:text-start text-white">
                The software covers the sounds of Hindi in isolation and within
                different words across all word positions.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img src={Motor} alt="" className="mb-4 lg:h-20 md:h-20 h-14" />
              </div>
              <div className="font-spacegrotesksemibold mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start dark:text-white">
                Motor-Based Intervention
              </div>
              <div className=" font-spacegrotesklight text-center lg:text-start md:text-start dark:text-gray-300">
                Incorporates both perceptual and production training.
              </div>
            </div>

            <div className="bg-[#2D8CFF] rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img src={Visual} alt="" className="lg:h-24 md:h-24 h-14" />
              </div>
              <div className="font-spacegrotesksemibold text-white mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start">
                Visual, Auditory Stimulation
              </div>
              <div className="text-white font-spacegrotesklight text-center lg:text-start md:text-start">
                Emphasize the importance of both senses in the learning process
                for individuals with speech disorders.
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl lg:h-64 lg:w-96 md:h-64 md:w-96 max-w-96">
              <div className="flex items-center justify-center lg:items-start lg:justify-start md:items-start md:justify-start">
                <img
                  src={Learning}
                  alt=""
                  className="mb-4 lg:h-20 md:h-20 h-14"
                />
              </div>
              <div className="font-spacegrotesksemibold mb-2 lg:text-2xl md:text-2xl text-lg text-center lg:text-start md:text-start dark:text-white">
                Multimodal Learning
              </div>
              <div className="font-spacegrotesklight text-center lg:text-start md:text-start dark:text-gray-300">
                Multimodal approach with visual & cues and 3-Dimensional
                animations for effective learning.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-center lg:block">
          <div className="border-y-4 p-1 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            Strengths
          </div>
        </div>

        <div>
          <div className="grid lg:grid-cols-2 grid-cols-1">
            <div className="lg:ml-20 flex flex-col gap-8 items-center justify-center">
              <div className="lg:hidden flex justify-center items-center mt-10">
                <img
                  src={RealTIme}
                  alt=""
                  className="h-[200px] md:h-[300px] sm:h-[300px]"
                />
              </div>
              <div className="lg:text-4xl md:text-3xl text-xl p-1 lg:p-0 lg:text-start text-center font-spacegrotesksemibold dark:text-white">
                Real-Time Speech Detection and Weekly Test Analysis
              </div>
              <div className="font-spacegroteskregular lg:text-xl md:text-xl text-sm lg:text-start text-center p-4 lg:p-0 dark:text-gray-300">
                Unlock the potential of your voice through cutting-edge
                technology. Our platform not only hears your words but guides
                you towards eloquence with precision.
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <img src={RealTIme} alt="" className="h-[400px]" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2">
            <div className="flex justify-center mt-10 lg:mt-0 md:mt-0">
              <img
                src={Dimensional}
                alt=""
                className="lg:h-[400px] md:h-[400px] h-[200px]"
              />
            </div>
            <div className="lg:ml-20 ml-0 flex flex-col gap-8 items-center justify-center lg:mt-0 md:mt-0 mt-10">
              <div className="lg:text-4xl md:text-3xl text-xl p-1 lg:p-0 lg:text-start text-center font-spacegrotesksemibold dark:text-white">
                Personalized Adaptive learning
              </div>
              <div className="font-spacegroteskregular lg:text-xl md:text-xl text-sm lg:text-start text-center p-4 lg:p-0 dark:text-gray-300">
                NeuroAi adjusts difficulty and content based on each child’s performance, creating a custom learning path instead of a fixed curriculum.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section  */}
<div id="pricing">
  <div className="flex items-center justify-center lg:block">
    <div className="border-y-4 p-1 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
      Pricing Plans
    </div>
  </div>

  <div className="lg:px-20 px-4 lg:mt-12 md:mt-10 mt-8 pb-10">
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-16 max-w-5xl mx-auto">
      {/* Freemium Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-spacegrotesksemibold text-2xl dark:text-white mb-1">
            Freemium
          </h3>
          <p className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">
            Perfect for getting started
          </p>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="font-spacegrotesksemibold text-4xl dark:text-white">₹0</span>
            <span className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">/forever</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex-grow mb-5">
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-gray-700 dark:text-gray-300">5 practice sessions per week</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-gray-700 dark:text-gray-300">Basic phonics training</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-gray-700 dark:text-gray-300">Simple progress tracking</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-gray-700 dark:text-gray-300">Community resources & articles</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={getstarted}
          className="w-full py-3 bg-gray-800 dark:bg-gray-700 rounded-lg font-spacegroteskmedium text-white hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 text-sm"
        >
          Get Started Free
        </button>
      </div>

      {/* Premium Plan */}
      <div className="relative bg-gradient-to-br from-[#2D8CFF] to-[#1a5bb8] rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
        {/* Popular Badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-[#89D85D] text-black px-4 py-1 rounded-full font-spacegroteskmedium text-xs shadow-lg">
            Most Popular
          </div>
        </div>

        {/* Header */}
        <div className="mb-4 mt-2">
          <h3 className="font-spacegrotesksemibold text-2xl text-white mb-1">
            Premium
          </h3>
          <p className="font-spacegroteskregular text-sm text-white text-opacity-90">
            Unlock your full potential
          </p>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="font-spacegrotesksemibold text-4xl text-white">₹499</span>
            <span className="font-spacegroteskregular text-sm text-white text-opacity-80">/month</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex-grow mb-5">
          <div className="bg-white bg-opacity-10 rounded-lg px-3 py-2 mb-3">
            <p className="font-spacegroteskmedium text-white text-xs">Everything in Free, plus:</p>
          </div>
          
          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#89D85D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-white">Unlimited practice sessions</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#89D85D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-white">Advanced 3D animations</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#89D85D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-white">Real-time speech analysis</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#89D85D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-white">Personalized learning paths</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#89D85D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-white">Weekly reports & certificates</span>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-[#89D85D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-spacegroteskregular text-sm text-white">Priority support</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={getstarted}
          className="w-full py-3 bg-[#89D85D] rounded-lg font-spacegroteskmedium text-black hover:bg-[#7bc34d] transition-all duration-200 shadow-lg text-sm"
        >
          Upgrade to Premium →
        </button>
      </div>
    </div>
  </div>
</div>

      <div>
        <div className="bg-[#F3F3F3] dark:bg-gray-800 lg:my-32 md:my-32 my-10 mx-4 md:mx-32 rounded-3xl">
          <div className="grid lg:grid-cols-2">
            <div className="text-center p-10 flex flex-col lg:items-start items-center justify-center gap-6">
              <div className="lg:text-4xl md:text-3xl text-2xl font-spacegroteskmedium dark:text-white">
                Let's Make things happen!
              </div>
              <div className="font-spacegroteskregular lg:text-lg md:text-lg text-sm lg:text-start text-center dark:text-gray-300">
                To get started and gain some insights and knowledge about speech
                disorders, how to cure them and related stuff go to the articles
                section.
              </div>
              <div className="flex justify-center items-center w-full lg:justify-start">
                <button className="p-4 bg-[#89D85D] rounded-md font-spacegroteskmedium hover:bg-opacity-90"
                  onClick={() => navigate('/articles')}
                >
                  Read Articles →
                </button>
              </div>
            </div>
            <div className="flex justify-center lg:p-4 order-1 ">
              <img
                src={Illustration}
                alt=""
                className="lg:w-[300px] lg:h-[320px] md:w-[300px] md:h-[320px] w-[200px] h-[220px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div id="contact">
        <div className="flex items-center justify-center lg:block">
          <div className="border-y-4 p-1 lg:mt-36 md:mt-32 sm:mt-14 mt-16 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            Contact Us
          </div>
        </div>

        <div>
          <div className="grid lg:grid-cols-2 lg:mt-12 md:mt-12">
            <div className="flex justify-center lg:mt-0 md:mt-0 mt-10">
              <img src={Contact} alt="" className="lg:h-4/5" />
            </div>

            <div>
              <div className="lg:p-8 md:p-8 p-2">
                <div className="flex items-center justify-center">
                  <div className="font-spacegroteskmedium lg:text-4xl md:text-3xl hidden lg:block dark:text-white">
                    Connect With Us
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col lg:flex-row md:flex-row lg:justify-between md:justify-between">
                    <input
                      className="px-4 py-3 lg:w-full md:w-full outline-none font-spacegrotesksemibold m-3 rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="firstName"
                      placeholder="First Name"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />

                    <input
                      className="px-4 py-3 lg:w-full md:w-full outline-none m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="lastName"
                      placeholder="Last Name"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      className="px-4 py-3 outline-none m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="email"
                      placeholder="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      className="px-4 py-3 outline-none m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />

                    <input
                      className="px-4 py-3 outline-none m-3  font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] dark:bg-gray-800 dark:text-white dark:border-gray-600"
                      name="message"
                      placeholder="Message"
                      type="text"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                    <div className="flex justify-items-center">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#89D85D] border-[#89D85D] w-full px-4 py-3 m-3 font-spacegrotesksemibold rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Sending...' : 'Send the message →'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="signup"
      />

      
    </div>
  );
}
