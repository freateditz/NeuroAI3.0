import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import AuthModal from "./AuthModal";
import Modal from "./LogoutModal";
import ThemeToggle from "./ThemeToggle";
import logoImg from "../assets/logo.png";

const publicNav = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Articles", href: "/articles" },
];

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div
          className={`mx-4 lg:mx-8 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "bg-transparent"
          }`}
          style={scrolled ? { background: darkMode ? 'rgba(0,0,0,0.75)' : 'rgba(244,239,232,0.92)' } : {}}
        >
          <div className="flex items-center justify-between px-5 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoImg} alt="NeuroAI" className="w-8 h-8 object-contain" />
              <span className="font-cormorant font-light text-2xl text-white tracking-tight">
                Neuro<em className="text-teal-300">AI</em>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {publicNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  {user?.role === "parent" ? (
                    <Link to="/parent/dashboard" className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${isActive("/parent/dashboard") ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                      Parent Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link to="/dashboard" className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${isActive("/dashboard") ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                        Dashboard
                      </Link>
                      <Link to="/learning-path" className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${isActive("/learning-path") ? "bg-white/10 text-white" : "text-indigo-400 hover:text-indigo-300 hover:bg-white/5"}`}>
                        Learning Path
                      </Link>
                      <Link to="/learning" className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${isActive("/learning") ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                        Learning
                      </Link>
                      <Link to="/chatbot" className={`px-4 py-2 rounded-xl text-sm font-inter font-medium transition-all duration-200 ${isActive("/chatbot") ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                        AI Chat
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />

              {isAuthenticated ? (
                <div className="relative cursor-pointer" onClick={() => setIsModalOpen(!isModalOpen)}>
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-indigo-500/40 hover:ring-indigo-500 transition-all"
                    src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                    alt={user.name}
                  />
                  <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2 rounded-xl bg-white hover:bg-gray-100 text-black text-sm font-inter font-medium transition-all duration-200"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl border border-white/10 text-white"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div
            ref={sidebarRef}
            className="absolute inset-y-0 right-0 w-72 border-l border-white/10 p-6 shadow-2xl"
            style={{ background: darkMode ? '#0d0e1f' : '#f4efe8' }}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="NeuroAI" className="w-7 h-7 object-contain" />
                <span className="font-cormorant font-light text-2xl text-white">
                  Neuro<em className="text-teal-300">AI</em>
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1">
              {publicNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-inter font-medium transition-all ${
                    isActive(item.href) ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
                  {user?.role === "parent" ? (
                    <Link to="/parent/dashboard" onClick={() => setSidebarOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-inter font-medium text-white/60 hover:text-white hover:bg-white/5">
                      Parent Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-inter font-medium text-white/60 hover:text-white hover:bg-white/5">Dashboard</Link>
                      <Link to="/learning-path" onClick={() => setSidebarOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-inter font-medium text-indigo-400 hover:text-indigo-300 hover:bg-white/5">Learning Path</Link>
                      <Link to="/learning" onClick={() => setSidebarOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-inter font-medium text-white/60 hover:text-white hover:bg-white/5">Learning</Link>
                      <Link to="/chatbot" onClick={() => setSidebarOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-inter font-medium text-white/60 hover:text-white hover:bg-white/5">AI Chat</Link>
                    </>
                  )}
                </div>
              )}

              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={() => { setIsAuthModalOpen(true); setSidebarOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-black text-sm font-inter font-medium transition-all"
                  >
                    Get Started Free
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="signup"
      />
    </>
  );
}
