import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const textMuted = darkMode ? 'rgba(248,250,252,0.4)' : 'rgba(30,27,75,0.5)';
  const textFaint = darkMode ? 'rgba(248,250,252,0.25)' : 'rgba(30,27,75,0.35)';
  const dotBg = darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(99,102,241,0.35)';
  const tagBg = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.08)';
  const tagBorder = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.2)';
  const dividerBorder = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.12)';

  const handleNavigation = (e, section) => {
    e.preventDefault();
    if (section === 'articles') {
      navigate('/articles');
    } else {
      if (window.location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const quickAccess = [
    { label: 'Features', section: 'features' },
    { label: 'Pricing', section: 'pricing' },
    { label: 'Articles', section: 'articles' },
    { label: 'About', href: '/about' },
    { label: 'Contact', section: 'contact' },
  ];

  const linkColor = darkMode ? 'rgba(248,250,252,0.4)' : 'rgba(28,19,8,0.5)';
  const linkHover = darkMode ? '#f8fafc' : '#1c1308';
  const brandText = darkMode ? '#f8fafc' : '#1c1308';

  return (
    <footer className="relative overflow-hidden" style={{
      background: darkMode ? '#030410' : '#ede7dd',
      borderTop: darkMode ? '1px solid rgba(0,255,192,0.1)' : '1px solid rgba(180,165,145,0.5)',
      boxShadow: darkMode ? 'inset 0 1px 0 rgba(0,255,192,0.06)' : 'inset 0 2px 4px rgba(160,148,130,0.2)',
    }}>
      {/* Subtle floating cloud */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,255,192,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <img src={logoImg} alt="NeuroAI" className="w-9 h-9 object-contain" />
              <span className="font-cormorant font-light text-2xl" style={{ color: brandText }}>
                Neuro<em className={darkMode ? 'text-teal-300' : 'text-indigo-600'}>AI</em>
              </span>
            </div>
            <p className="font-inter text-sm leading-relaxed max-w-xs" style={{ color: textMuted }}>
              Empowering neurodiverse children to find their voice through AI-driven
              speech therapy and adaptive learning technology.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {['🧠 AI-Powered', '🎙️ Speech Analysis', '📊 Progress Tracking'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full font-inter text-xs"
                  style={{ background: tagBg, border: `1px solid ${tagBorder}`, color: textMuted }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Access */}
          <div>
            <h4 className={`font-syne font-bold text-sm mb-5 uppercase tracking-widest ${darkMode ? 'text-white' : 'text-indigo-900'}`}>Quick Access</h4>
            <ul className="space-y-3">
              {quickAccess.map((link) => (
                <li key={link.label}>
                  {link.section ? (
                    <a
                      href={`#${link.section}`}
                      onClick={(e) => handleNavigation(e, link.section)}
                      className="font-inter text-sm transition-colors cursor-pointer flex items-center gap-2 group"
                      style={{ color: linkColor, textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = linkHover}
                      onMouseLeave={e => e.currentTarget.style.color = linkColor}
                    >
                      <span
                        className="w-1 h-1 rounded-full transition-colors"
                        style={{ background: dotBg }}
                      />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="font-inter text-sm transition-colors flex items-center gap-2"
                      style={{ color: linkColor, textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.color = linkHover}
                      onMouseLeave={e => e.currentTarget.style.color = linkColor}
                    >
                      <span className="w-1 h-1 rounded-full" style={{ background: dotBg }} />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`font-syne font-bold text-sm mb-5 uppercase tracking-widest ${darkMode ? 'text-white' : 'text-indigo-900'}`}>Resources</h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'Accessibility', href: '/accessibility' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-inter text-sm transition-colors flex items-center gap-2"
                    style={{ color: linkColor, textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = linkHover}
                    onMouseLeave={e => e.currentTarget.style.color = linkColor}
                  >
                    <span className="w-1 h-1 rounded-full" style={{ background: dotBg }} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: `1px solid ${dividerBorder}` }}
        >
          <p className="font-inter text-sm" style={{ color: textFaint }}>
            © {currentYear} NeuroAI. All rights reserved.
          </p>
          <p className="font-inter text-xs" style={{ color: textFaint }}>
            Empowering Every Unique Mind ✦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
