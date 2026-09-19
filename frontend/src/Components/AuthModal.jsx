import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/logo.png";

const PROBLEM_DESCRIPTIONS = [
  { value: "stuttering", label: "Stuttering" },
  { value: "stammering", label: "Stammering" },
  { value: "lisp", label: "Lisp" },
  { value: "articulation", label: "Articulation Disorder" },
  { value: "phonological_disorder", label: "Phonological Disorder" },
  { value: "apraxia", label: "Apraxia of Speech" },
  { value: "dysarthria", label: "Dysarthria" },
  { value: "voice_disorder", label: "Voice Disorder" },
  { value: "other", label: "Other" },
];

const REGIONS = [
  "North America", "South America", "Europe", "Asia",
  "Africa", "Australia/Oceania", "Middle East",
];

export default function AuthModal({ isOpen, onClose, mode: initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", phoneNumber: "",
    childAge: "", region: "", problemDescription: "", role: "student",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (mode === "login") {
        result = await login(formData.email, formData.password);
      } else {
        const isStudent = formData.role === "student";
        if (isStudent && (!formData.phoneNumber || !formData.childAge || !formData.region || !formData.problemDescription)) {
          setError("Please fill in all required fields");
          setLoading(false);
          return;
        }
        if (isStudent && (formData.childAge < 1 || formData.childAge > 18)) {
          setError("Child age must be between 1 and 18");
          setLoading(false);
          return;
        }
        result = await signup(
          formData.name, formData.email, formData.password,
          formData.phoneNumber, isStudent ? parseInt(formData.childAge) : undefined,
          formData.region, formData.problemDescription, formData.role,
        );
      }

      if (result.success) {
        const role = result.user?.role || (mode === "signup" ? formData.role : "student");
        onClose();
        setFormData({ name: "", email: "", password: "", phoneNumber: "", childAge: "", region: "", problemDescription: "", role: "student" });
        if (role === "parent") navigate("/parent/dashboard");
        else navigate("/dashboard");
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setFormData({ name: "", email: "", password: "", phoneNumber: "", childAge: "", region: "", problemDescription: "", role: "student" });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(248,250,252,0.6)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(5,5,5,0.97)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 60px rgba(0,255,192,0.06)',
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[60px]" style={{ background: 'rgba(0,255,192,0.06)' }} />
          <div className="absolute bottom-0 right-1/4 w-48 h-32 rounded-full blur-[50px]" style={{ background: 'rgba(0,255,192,0.04)' }} />
        </div>

        {/* Scrollable content */}
        <div className="relative z-10 p-8" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(248,250,252,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f8fafc'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(248,250,252,0.5)'; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo + title */}
          <div className="flex items-center gap-3 mb-6">
            <img src={logoImg} alt="NeuroAI" className="w-9 h-9 object-contain" />
            <div>
              <h2 className="font-cormorant font-light text-2xl text-white">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="font-inter text-xs mt-0.5" style={{ color: 'rgba(248,250,252,0.4)' }}>
                {mode === "login" ? "Sign in to continue your journey" : "Start your learning journey today"}
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div
            className="flex rounded-2xl p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => mode !== m && toggleMode()}
                className="flex-1 py-2 rounded-xl text-sm font-inter font-semibold transition-all"
                style={
                  mode === m
                    ? { background: 'rgba(255,255,255,0.12)', color: '#fff', borderBottom: '1px solid rgba(0,255,192,0.3)' }
                    : { color: 'rgba(248,250,252,0.4)' }
                }
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-2xl font-inter text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label style={labelStyle}>I am a</label>
                  <div className="flex gap-2">
                    {["student", "parent"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: r })}
                        className="flex-1 py-2.5 rounded-2xl text-sm font-inter font-semibold transition-all"
                        style={
                          formData.role === r
                            ? { background: 'rgba(0,255,192,0.08)', border: '1px solid rgba(0,255,192,0.25)', color: '#5eead4' }
                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(248,250,252,0.4)' }
                        }
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" style={inputStyle} />
                </div>
              </>
            )}

            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="••••••••" style={inputStyle} />
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required={formData.role === "student"} placeholder="+91 98765 43210" style={inputStyle} />
                </div>

                {formData.role === "student" && (
                  <>
                    <div>
                      <label style={labelStyle}>Child's Age *</label>
                      <input type="number" name="childAge" value={formData.childAge} onChange={handleChange} required min="1" max="18" placeholder="Age (1-18)" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Region *</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        required
                        style={{ ...inputStyle, appearance: 'none' }}
                      >
                        <option value="" style={{ background: '#0d0e1f' }}>Select region</option>
                        {REGIONS.map((r) => <option key={r} value={r} style={{ background: '#0d0e1f' }}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Primary Speech Challenge *</label>
                      <select
                        name="problemDescription"
                        value={formData.problemDescription}
                        onChange={handleChange}
                        required
                        style={{ ...inputStyle, appearance: 'none' }}
                      >
                        <option value="" style={{ background: '#0d0e1f' }}>Select challenge</option>
                        {PROBLEM_DESCRIPTIONS.map((p) => <option key={p.value} value={p.value} style={{ background: '#0d0e1f' }}>{p.label}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-inter font-semibold text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? 'rgba(255,255,255,0.5)' : '#ffffff',
                color: '#000',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
