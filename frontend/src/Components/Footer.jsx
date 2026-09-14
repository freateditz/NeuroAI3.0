import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    const handleNavigation = (e, section) => {
        e.preventDefault();
        
        if (section === 'articles') {
            navigate('/articles');
        } else {
            // Navigate to home page first if not already there
            if (window.location.pathname !== '/') {
                navigate('/');
                // Wait for navigation to complete, then scroll
                setTimeout(() => {
                    const element = document.getElementById(section);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            } else {
                // Already on home page, just scroll
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    };

    const quickAccess = [
        { label: 'Features', section: 'features' },
        { label: 'Pricing', section: 'pricing' },
        { label: 'Articles', section: 'articles' },
        { label: 'About', href: '/about' },
        { label: 'Contact Us', section: 'contact' }
    ];

    const externalLinks = [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
    ];

    

    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white mt-auto transition-colors duration-200 border-t-2 border-gray-200 dark:border-gray-700">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About NeuroAi */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg shadow-lg">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">NeuroAi</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Speech Learning Platform</p>
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Helping every child find their voice through safe, intelligent speech learning. A secure, accessible digital platform empowering children with AI-driven speech therapy while maintaining the highest standards of security and privacy.
                        </p>
                    </div>

                    {/* Quick Access */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Access</h3>
                        <ul className="space-y-3">
                            {quickAccess.map((link) => (
                                <li key={link.label}>
                                    {link.section ? (
                                        <a
                                            href={`#${link.section}`}
                                            onClick={(e) => handleNavigation(e, link.section)}
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 flex items-center group cursor-pointer"
                                        >
                                            <svg className="h-3 w-3 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link 
                                            to={link.href}
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 flex items-center group"
                                        >
                                            <svg className="h-3 w-3 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* External Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Resources</h3>
                        <ul className="space-y-3">
                            {externalLinks.map((link) => (
                                <li key={link.label}>
                                    <a 
                                        href={link.href} 
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 flex items-center group"
                                    >
                                        <svg className="h-3 w-3 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

              
              
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-300 dark:border-gray-700">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                © {currentYear} NeuroAi. All rights reserved.
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                                <a 
                                    href="/sitemap" 
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                                >
                                    Sitemap
                                </a>
                                <span className="text-gray-400 dark:text-gray-600">|</span>
                                <a 
                                    href="/accessibility" 
                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition-colors"
                                >
                                    Accessibility
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;