import {
    Bars3Icon,
    MoonIcon,
    SunIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ThemeAnimationType,
    useModeAnimation,
} from "react-theme-switch-animation";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import AuthModal from "./AuthModal";
import Modal from "./LogoutModal";

const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Articles", href: "/articles" },
];

function Example() {
    const { user, isAuthenticated } = useAuth();
    const { darkMode, toggleTheme } = useTheme();
    const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
        animationType: ThemeAnimationType.CIRCLE,
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toggleModal = () => (isModalOpen ? closeModal() : openModal());

    const handleThemeToggle = () => {
        toggleSwitchTheme();
        // Sync our context with the animation hook
        setTimeout(() => {
            toggleTheme(isDarkMode);
        }, 0);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            {/* Navbar */}
            <div className="flex justify-between items-center p-4 mb-12 dark:bg-gray-900 transition-colors">
                <div className="font-spacegroteskbold text-2xl lg:text-3xl ml-4 dark:text-white">
                    <Link to="/">NeuroAi</Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:flex space-x-8 mr-24 items-center">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className="font-spacegroteskregular cursor-pointer dark:text-gray-300 hover:dark:text-white"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {isAuthenticated && (
                        <div className="flex gap-8">
                            {user?.role === 'parent' ? (
                                <Link
                                    to="/parent/dashboard"
                                    className="font-spacegroteskregular dark:text-gray-300 hover:dark:text-white"
                                >
                                    Parent Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="font-spacegroteskregular dark:text-gray-300 hover:dark:text-white"
                                    >
                                        My Dashboard
                                    </Link>
                                    <Link
                                        to="/learning-path"
                                        className="font-spacegroteskregular dark:text-gray-300 hover:dark:text-white text-blue-500"
                                    >
                                        Learning Path
                                    </Link>
                                    <Link
                                        to="/learning"
                                        className="font-spacegroteskregular dark:text-gray-300 hover:dark:text-white"
                                    >
                                        Learning
                                    </Link>
                                    <Link
                                        to="/chatbot"
                                        className="font-spacegroteskregular dark:text-gray-300 hover:dark:text-white"
                                    >
                                        Chatbot
                                    </Link>
                                    <Link
                                        to="/share-parent"
                                        className="font-spacegroteskregular dark:text-gray-300 hover:dark:text-white text-blue-500"
                                    >
                                        Share With Parent
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* Dark Mode Toggle Button */}
                    <button
                        ref={ref}
                        onClick={handleThemeToggle}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <SunIcon className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <MoonIcon className="h-5 w-5 text-gray-700" />
                        )}
                    </button>

                    {isAuthenticated ? (
                        <div
                            onClick={toggleModal}
                            className="relative cursor-pointer"
                        >
                            <img
                                className="h-10 w-10 rounded-full"
                                src={
                                    user.picture ||
                                    `https://ui-avatars.com/api/?name=${user.name}&background=2D8CFF&color=fff`
                                }
                                alt={user.name}
                            />
                            <Modal isOpen={isModalOpen} onClose={closeModal} />
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="border rounded-md p-2 font-spacegroteskregular border-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                        >
                            Sign Up
                        </button>
                    )}

                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => setIsAuthModalOpen(false)}
                        mode="signup"
                    />
                </div>

                {/* Mobile Hamburger */}
                <div className="lg:hidden mr-4 flex gap-2 items-center">
                    {/* Dark Mode Toggle Button for Mobile */}
                    <button
                        ref={ref}
                        onClick={handleThemeToggle}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? (
                            <SunIcon className="h-5 w-5 text-yellow-500" />
                        ) : (
                            <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md border dark:border-gray-600 dark:text-white"
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-10">
                    <div
                        ref={sidebarRef}
                        className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-lg z-20 p-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-spacegroteskbold text-2xl dark:text-white">
                                NeuroAi
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-md border dark:border-gray-600 dark:text-white"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className="block px-4 py-2 text-lg font-spacegroteskregular text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isAuthenticated && (
                                <div className="space-y-4">
                                    {user?.role === 'parent' ? (
                                        <Link
                                            to="/parent/dashboard"
                                            onClick={() => setSidebarOpen(false)}
                                            className="block px-4 py-2 text-lg font-spacegroteskregular text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                        >
                                            Parent Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setSidebarOpen(false)}
                                                className="block px-4 py-2 text-lg font-spacegroteskregular text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                My Dashboard
                                            </Link>
                                            <Link
                                                to="/learning-path"
                                                onClick={() => setSidebarOpen(false)}
                                                className="block px-4 py-2 text-lg font-spacegroteskregular text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                Learning Path
                                            </Link>
                                            <Link
                                                to="/learning"
                                                onClick={() => setSidebarOpen(false)}
                                                className="block px-4 py-2 text-lg font-spacegroteskregular text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                Learning
                                            </Link>
                                            <Link
                                                to="/chatbot"
                                                onClick={() => setSidebarOpen(false)}
                                                className="block px-4 py-2 text-lg font-spacegroteskregular text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                Chatbot
                                            </Link>
                                            <Link
                                                to="/share-parent"
                                                onClick={() => setSidebarOpen(false)}
                                                className="block px-4 py-2 text-lg font-spacegroteskregular text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                            >
                                                Share With Parent
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}

                            {!isAuthenticated && (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="w-full border rounded-md p-2 font-spacegroteskregular border-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                                >
                                    Sign Up
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Example;
