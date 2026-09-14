import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

  export default function About() {

    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mission");
    return (
    <div className="dark:bg-gray-900 min-h-screen">
      {/* NEW HERO SECTION: Clean Split Layout */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 pt-20 pb-16 lg:pt-24 lg:pb-24">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-[#2D8CFF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-[#89D85D] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Content */}
            <div className="max-w-2xl">
              
              <h1 className="text-5xl lg:text-7xl font-spacegrotesksemibold text-gray-900 dark:text-white leading-tight mb-6">
                Find Your Voice, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D8CFF] to-[#89D85D]">
                  Share Your Story.
                </span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-spacegroteskregular">
                We bridge the gap between technology and human connection. Experience a new era of speech therapy that is accessible, intelligent, and designed entirely around <b>you</b>.
              </p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate("/learning")}
                  className="px-8 py-4 bg-[#2D8CFF] hover:bg-[#1a5bb8] text-white rounded-xl font-spacegroteskmedium transition-all duration-300 shadow-lg hover:shadow-[#2D8CFF]/25 flex items-center gap-2"
                >
                  Start Your Journey
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
                
              </div>
            </div>

            {/* Right Column: Abstract Visual Representation */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Main Visual Container */}
              <div className="relative w-full max-w-md aspect-square">
                {/* Abstract Card 1 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2D8CFF] to-[#1a5bb8] rounded-3xl opacity-20 transform rotate-12 blur-sm"></div>
                
                {/* Main Card */}
                <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col justify-between overflow-hidden">
                  
                  {/* Visualizing "Speech" - Animated Bars */}
                  <div className="flex items-center justify-center gap-2 h-32 mb-6">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-4 bg-[#2D8CFF] rounded-full animate-pulse"
                        style={{ 
                          height: `${Math.max(40, Math.random() * 100)}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#89D85D]/20 flex items-center justify-center text-[#89D85D]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      </div>
                      <div>
                        <div className="h-2 w-24 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Fluency Score</span>
                        <span className="text-xs font-bold text-[#89D85D]">98%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-[#89D85D] h-2 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-8">
            <div className="text-center">
              <div className="font-spacegrotesksemibold text-5xl lg:text-6xl text-[#2D8CFF] dark:text-[#89D85D] mb-2">
                10K+
              </div>
              <div className="font-spacegroteskmedium text-gray-700 dark:text-gray-300">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="font-spacegrotesksemibold text-5xl lg:text-6xl text-[#2D8CFF] dark:text-[#89D85D] mb-2">
                95%
              </div>
              <div className="font-spacegroteskmedium text-gray-700 dark:text-gray-300">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="font-spacegrotesksemibold text-5xl lg:text-6xl text-[#2D8CFF] dark:text-[#89D85D] mb-2">
                500K+
              </div>
              <div className="font-spacegroteskmedium text-gray-700 dark:text-gray-300">
                Sessions Completed
              </div>
            </div>
            <div className="text-center">
              <div className="font-spacegrotesksemibold text-5xl lg:text-6xl text-[#2D8CFF] dark:text-[#89D85D] mb-2">
                24/7
              </div>
              <div className="font-spacegroteskmedium text-gray-700 dark:text-gray-300">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section - Different Layout */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="lg:text-5xl md:text-4xl text-3xl font-spacegrotesksemibold dark:text-white mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-[#2D8CFF] mx-auto"></div>
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#2D8CFF] rounded-full flex items-center justify-center text-white font-spacegrotesksemibold text-xl">
                  1
                </div>
                <div>
                  <h3 className="font-spacegrotesksemibold text-xl dark:text-white mb-2">The Beginning</h3>
                  <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 leading-relaxed">
                    Founded with a vision to make quality speech therapy accessible to everyone, 
                    our platform was born from the realization that millions of individuals with 
                    speech disorders lack access to effective, engaging, and affordable training solutions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#89D85D] rounded-full flex items-center justify-center text-black font-spacegrotesksemibold text-xl">
                  2
                </div>
                <div>
                  <h3 className="font-spacegrotesksemibold text-xl dark:text-white mb-2">Innovation & Research</h3>
                  <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 leading-relaxed">
                    Through extensive research and collaboration with speech therapists, educators, 
                    and technology experts, we've created a comprehensive platform that combines 
                    the latest in AI technology, 3D visualization, and evidence-based therapeutic techniques.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#2D8CFF] rounded-full flex items-center justify-center text-white font-spacegrotesksemibold text-xl">
                  3
                </div>
                <div>
                  <h3 className="font-spacegrotesksemibold text-xl dark:text-white mb-2">Today & Beyond</h3>
                  <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 leading-relaxed">
                    Today, we're proud to serve thousands of users, helping them build confidence, 
                    improve communication skills, and achieve their speech goals through our innovative, 
                    user-friendly platform. Our journey has just begun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Values - Tabbed Interface */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="lg:text-5xl md:text-4xl text-3xl font-spacegrotesksemibold dark:text-white mb-4">
              What Drives Us
            </h2>
            <div className="w-24 h-1 bg-[#2D8CFF] mx-auto"></div>
          </div>

          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab("mission")}
              className={`px-8 py-3 rounded-lg font-spacegroteskmedium transition-all duration-300 ${
                activeTab === "mission"
                  ? "bg-[#2D8CFF] text-white shadow-lg scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setActiveTab("vision")}
              className={`px-8 py-3 rounded-lg font-spacegroteskmedium transition-all duration-300 ${
                activeTab === "vision"
                  ? "bg-[#2D8CFF] text-white shadow-lg scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Our Vision
            </button>
            <button
              onClick={() => setActiveTab("values")}
              className={`px-8 py-3 rounded-lg font-spacegroteskmedium transition-all duration-300 ${
                activeTab === "values"
                  ? "bg-[#2D8CFF] text-white shadow-lg scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Our Values
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-10 shadow-xl min-h-[300px] flex items-center justify-center">
            {activeTab === "mission" && (
              <div className="text-center max-w-3xl animate-fade-in">
                <div className="w-20 h-20 bg-[#2D8CFF] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-3xl dark:text-white mb-6">Our Mission</h3>
                <p className="font-spacegroteskregular text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  To empower individuals with speech challenges through innovative, accessible, and 
                  personalized training solutions that foster confidence and effective communication. 
                  We believe every voice deserves to be heard, understood, and celebrated.
                </p>
              </div>
            )}

            {activeTab === "vision" && (
              <div className="text-center max-w-3xl animate-fade-in">
                <div className="w-20 h-20 bg-[#89D85D] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-3xl dark:text-white mb-6">Our Vision</h3>
                <p className="font-spacegroteskregular text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  A world where every individual with speech disorders has access to world-class therapy 
                  tools, enabling them to communicate confidently and participate fully in society. We 
                  envision a future where speech challenges are no longer barriers to success.
                </p>
              </div>
            )}

            {activeTab === "values" && (
              <div className="text-center max-w-3xl animate-fade-in">
                <div className="w-20 h-20 bg-[#2D8CFF] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-3xl dark:text-white mb-6">Our Values</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#89D85D] rounded-full mt-2"></div>
                    <div>
                      <div className="font-spacegroteskmedium text-gray-800 dark:text-white">Innovation</div>
                      <div className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">Pushing boundaries in speech therapy</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#89D85D] rounded-full mt-2"></div>
                    <div>
                      <div className="font-spacegroteskmedium text-gray-800 dark:text-white">Accessibility</div>
                      <div className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">Making therapy available to all</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#89D85D] rounded-full mt-2"></div>
                    <div>
                      <div className="font-spacegroteskmedium text-gray-800 dark:text-white">Empathy</div>
                      <div className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">Understanding every user's journey</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#89D85D] rounded-full mt-2"></div>
                    <div>
                      <div className="font-spacegroteskmedium text-gray-800 dark:text-white">Excellence</div>
                      <div className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">Delivering the highest quality</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#89D85D] rounded-full mt-2"></div>
                    <div>
                      <div className="font-spacegroteskmedium text-gray-800 dark:text-white">Inclusivity</div>
                      <div className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">Welcoming everyone's needs</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#89D85D] rounded-full mt-2"></div>
                    <div>
                      <div className="font-spacegroteskmedium text-gray-800 dark:text-white">Impact</div>
                      <div className="font-spacegroteskregular text-sm text-gray-600 dark:text-gray-400">Creating meaningful change</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div>
        <div className="flex items-center justify-center lg:block">
          <div className="border-y-4 lg:mt-20 md:mt-16 mt-12 font-spacegrotesksemibold border-black dark:border-white font-medium lg:text-4xl md:text-3xl sm:text-2xl text-2xl w-fit lg:ml-20 text-center dark:text-white">
            What Makes Us Different
          </div>
        </div>

        <div className="lg:px-20 px-4 py-10">
          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
            {/* Point 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#2D8CFF] rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-xl dark:text-white">Evidence-Based Approach</h3>
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300">
                Our methods are grounded in scientific research and developed in collaboration 
                with certified speech-language pathologists.
              </p>
            </div>

            {/* Point 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#89D85D] rounded-full p-3">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-xl dark:text-white">AI-Powered Personalization</h3>
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300">
                Our platform adapts to each user's unique needs, progress, and learning style 
                to deliver optimal results.
              </p>
            </div>

            {/* Point 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#2D8CFF] rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-xl dark:text-white">Engaging Technology</h3>
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300">
                We use 3D animations, gamification, and interactive exercises to make 
                learning enjoyable and effective.
              </p>
            </div>

            {/* Point 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#89D85D] rounded-full p-3">
                  <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-spacegrotesksemibold text-xl dark:text-white">Community Support</h3>
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300">
                Join a supportive community of learners and access expert guidance 
                throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Testimonials Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="lg:text-5xl md:text-4xl text-3xl font-spacegrotesksemibold dark:text-white mb-4">
              What Parents Say
            </h2>
            <div className="w-24 h-1 bg-[#2D8CFF] mx-auto mb-4"></div>
            <p className="font-spacegroteskregular text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from families who have experienced transformation through our platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 mb-4 italic">
                "My son has shown incredible progress in just 3 months. The 3D animations 
                make learning fun and he actually looks forward to his practice sessions. 
                This platform has been a game-changer for our family."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2D8CFF] rounded-full flex items-center justify-center text-white font-spacegrotesksemibold">
                  PS
                </div>
                <div>
                  <div className="font-spacegroteskmedium dark:text-white">Priya Sharma</div>
                  <div className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">Mother of 7-year-old</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 mb-4 italic">
                "The real-time feedback feature is amazing! We can track progress weekly and 
                the personalized learning path adapts to my daughter's needs. Highly recommend 
                to any parent dealing with speech challenges."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#89D85D] rounded-full flex items-center justify-center text-black font-spacegrotesksemibold">
                  RK
                </div>
                <div>
                  <div className="font-spacegroteskmedium dark:text-white">Rajesh Kumar</div>
                  <div className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">Father of 5-year-old</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 mb-4 italic">
                "As a working mother, I appreciate the flexibility this platform offers. 
                My daughter can practice anytime, and the engaging interface keeps her 
                motivated. We've seen tremendous improvement in her confidence."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2D8CFF] rounded-full flex items-center justify-center text-white font-spacegrotesksemibold">
                  AM
                </div>
                <div>
                  <div className="font-spacegroteskmedium dark:text-white">Anita Mehta</div>
                  <div className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">Mother of 9-year-old</div>
                </div>
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 mb-4 italic">
                "The holistic phonics training has made such a difference. My son can now 
                pronounce Hindi sounds correctly that he struggled with for years. The 
                premium support team is also very responsive and helpful."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#89D85D] rounded-full flex items-center justify-center text-black font-spacegrotesksemibold">
                  VG
                </div>
                <div>
                  <div className="font-spacegroteskmedium dark:text-white">Vikram Gupta</div>
                  <div className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">Father of 6-year-old</div>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 mb-4 italic">
                "Worth every penny! The weekly reports help us understand exactly where 
                our daughter stands and what areas need more focus. The platform has given 
                her the tools to communicate better at school."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#2D8CFF] rounded-full flex items-center justify-center text-white font-spacegrotesksemibold">
                  SD
                </div>
                <div>
                  <div className="font-spacegroteskmedium dark:text-white">Sneha Desai</div>
                  <div className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">Mother of 8-year-old</div>
                </div>
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="font-spacegroteskregular text-gray-700 dark:text-gray-300 mb-4 italic">
                "My son was hesitant about speech therapy until we found this platform. 
                The gamified approach and colorful interface made it feel like playing rather 
                than learning. Six months in and he's a different child!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#89D85D] rounded-full flex items-center justify-center text-black font-spacegrotesksemibold">
                  MR
                </div>
                <div>
                  <div className="font-spacegroteskmedium dark:text-white">Manoj Reddy</div>
                  <div className="font-spacegroteskregular text-sm text-gray-500 dark:text-gray-400">Father of 10-year-old</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-[#2D8CFF] via-[#1a5bb8] to-[#2D8CFF] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="lg:text-5xl md:text-4xl text-3xl font-spacegrotesksemibold mb-6">
            Ready to Transform Your Speech Journey?
          </h2>
          <p className="font-spacegroteskregular lg:text-xl md:text-lg text-base mb-10 text-white text-opacity-90 max-w-2xl mx-auto">
            Join thousands of families who are already experiencing life-changing results. 
            Start your free trial today and see the difference for yourself.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={() => navigate("/learning")}
              className="px-10 py-4 bg-[#89D85D] text-black rounded-lg font-spacegroteskmedium hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => navigate("/")}
              className="px-10 py-4 bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-spacegroteskmedium hover:bg-opacity-20 transition-all duration-200"
            >
              Explore Features
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white text-opacity-80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#89D85D]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }

