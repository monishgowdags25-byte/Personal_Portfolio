import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Phone, Github, Linkedin, Download, Sun, Moon, 
  Eye, ExternalLink, Award, BookOpen, Send, 
  CheckCircle2, ChevronRight, X, AlertCircle, Sparkles, Terminal, Code, Cpu
} from 'lucide-react';
import CreativeHeroVisual from './components/CreativeHeroVisual';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  // Theme management (Amber accent theme / Cyan accent theme)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'dark'; // Default to dark (Neon Orange theme)
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data fetching state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const [visitorsCount, setVisitorsCount] = useState(null);
  
  // Interaction state
  const [selectedProject, setSelectedProject] = useState(null);

  // Configuration for future Spline 3D Integration:
  // Simply paste your Spline scene URL here (e.g. "https://prod.spline.design/plycgAGKnhJGuAp1/scene.splinecode")
  // to instantly load the interactive 3D model in the center container.
  const [splineSceneUrl, setSplineSceneUrl] = useState('');

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '', website: '' });
  const [formStatus, setFormStatus] = useState('idle'); // idle | submitting | success | error
  const [formError, setFormError] = useState('');

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch Projects and Visitors Count on mount
  useEffect(() => {
    // 1. Fetch visitors and increment
    fetch(`${API_URL}/api/visitors`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to update visitor count');
        return res.json();
      })
      .then(data => setVisitorsCount(data.count))
      .catch(err => {
        console.warn('Visitor counter fallback:', err);
        setVisitorsCount(312); // standard fallback count if backend isn't reachable
      });

    // 2. Fetch projects
    fetch(`${API_URL}/api/projects`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoadingProjects(false);
      })
      .catch(err => {
        console.error('Projects retrieval failed:', err);
        setErrorProjects(err.message);
        setLoadingProjects(false);
      });
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    setFormError('');

    // Honeypot check: if website field is filled, silently resolve (pretend success for bots)
    if (formData.website) {
      setTimeout(() => {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '', website: '' });
      }, 800);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data.errors ? data.errors.map(err => err.msg).join(' ') : (data.error || 'Submission failed');
        throw new Error(errorMsg);
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setFormStatus('error');
      setFormError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300 selection:bg-accent selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Full Viewport Height Redesign Matching Reference Design) */}
      {/* ========================================================================= */}
      <div className="relative min-h-screen flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-6 bg-bg-primary border-b border-border-custom">
        
        {/* Ambient backdrop glow elements */}
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

        {/* TOP NAVBAR */}
        <header className="relative z-30 flex items-center justify-between w-full">
          <a href="#" className="font-display font-extrabold text-xl tracking-tight text-text-primary flex items-center gap-2 hover:opacity-85 transition-opacity">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="font-black">MONISH®</span>
          </a>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-12">
            <a href="#about" className="text-xs font-bold tracking-[0.25em] text-text-secondary hover:text-text-primary transition-colors uppercase">About</a>
            <a href="#services" className="text-xs font-bold tracking-[0.25em] text-text-secondary hover:text-text-primary transition-colors uppercase">Services</a>
            <a href="#projects" className="text-xs font-bold tracking-[0.25em] text-text-secondary hover:text-text-primary transition-colors uppercase">Projects</a>
            <a href="#contact" className="text-xs font-bold tracking-[0.25em] text-text-secondary hover:text-text-primary transition-colors uppercase">Contact</a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Theme switcher re-themed to toggle between Orange Glow & Cyan Glow */}
            <button 
              onClick={toggleTheme}
              aria-label="Toggle accent glow color scheme"
              className="p-2.5 rounded-full hover:bg-accent/10 border border-border-custom transition-all text-text-secondary hover:text-accent"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            
            {/* Premium Hamburger Menu Button (2 lines) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-full hover:bg-accent/10 border border-border-custom text-text-secondary hover:text-accent transition-all flex flex-col justify-center items-end gap-1.5 w-11 h-11 relative"
              aria-label="Toggle mobile menu"
            >
              <span className={`h-[2px] bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-5 rotate-45 translate-y-[4px]' : 'w-5'}`} />
              <span className={`h-[2px] bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'w-5 -rotate-45 -translate-y-[4px]' : 'w-3.5'}`} />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-4 right-4 z-40 bg-bg-card/95 backdrop-blur-xl border border-border-custom rounded-3xl p-6 shadow-2xl flex flex-col gap-4 md:hidden"
            >
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-text-secondary hover:text-accent transition-colors tracking-wider uppercase py-2">About</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-text-secondary hover:text-accent transition-colors tracking-wider uppercase py-2">Services</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-text-secondary hover:text-accent transition-colors tracking-wider uppercase py-2">Projects</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-text-secondary hover:text-accent transition-colors tracking-wider uppercase py-2">Contact</a>
              <a 
                href="/resume.pdf" 
                download="Monish_Gowda_GS_Resume.pdf"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full mt-2 py-3 bg-accent hover:bg-accent-hover text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-accent/15 transition-all"
              >
                <Download size={14} />
                <span>DOWNLOAD RESUME</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO MAIN BODY */}
        <main className="relative z-10 flex-grow flex flex-col md:grid md:grid-cols-12 gap-8 items-center justify-center my-8 md:my-0">
          
          {/* Background Big Typography */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <h1 className="text-[16vw] font-black leading-none uppercase tracking-tighter text-outline-glow select-none font-display pointer-events-none opacity-20">
              MONISH
            </h1>
          </div>

          {/* Left Block: Subtitle, Description, CTA (Columns 1-4) */}
          <div className="md:col-span-4 z-20 flex flex-col items-start text-left bg-black/40 md:bg-transparent p-6 md:p-0 rounded-[28px] border border-border-custom/50 md:border-none backdrop-blur-md md:backdrop-blur-none shadow-2xl md:shadow-none">
            <div className="flex items-center gap-2 mb-3 bg-bg-secondary/80 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full border border-border-custom md:border-none text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
              <span className="text-[9px] font-extrabold tracking-[0.3em] text-accent uppercase font-display">CREATIVE TECHNOLOGY</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold font-display leading-[1.1] tracking-tight text-white mb-4">
              LESS NOISE.<br />MORE IMPACT.
            </h2>
            
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-sm mb-8 font-sans">
              I help forward-thinking teams build immersive 3D interactive web experiences, high-performance full-stack web applications, and digital solutions that make a difference.
            </p>

            {/* Pill button + mini profile */}
            <div className="flex items-center gap-4">
              <a 
                href="#contact"
                className="flex items-center gap-3 px-6 py-4.5 rounded-full bg-white text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-accent hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 duration-200"
              >
                <span>BOOK A CALL</span>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs font-black leading-none">+</span>
              </a>
              
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full border border-border-custom overflow-hidden bg-bg-secondary p-[1px] flex items-center justify-center shadow-md">
                  <div className="w-full h-full rounded-full bg-accent/20 flex items-center justify-center text-accent text-[10px] font-black">MG</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white tracking-wide leading-none">Monish Gowda</span>
                  <span className="text-[8px] text-text-secondary font-semibold mt-0.5">Software Engineer</span>
                </div>
              </div>
            </div>
          </div>

          {/* Central Block: Interactive 3D Spline / Portrait card (Columns 5-8) */}
          <div className="md:col-span-4 z-10 w-full relative">
            <CreativeHeroVisual splineUrl={splineSceneUrl} />
          </div>

          {/* Right Block: Stats visual card links (Columns 9-12) */}
          <div className="md:col-span-4 z-20 self-end md:justify-self-end w-full max-w-[240px]">
            <a 
              href="#projects"
              className="group block bento-card bg-bg-card/75 backdrop-blur-md p-6 rounded-3xl border border-border-custom hover:border-accent flex flex-col justify-between h-40 shadow-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-98"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <span className="text-4xl font-black font-display text-white tracking-tight leading-none">12+</span>
                <span className="p-2 rounded-xl bg-bg-secondary text-text-secondary group-hover:text-accent group-hover:bg-accent-light border border-border-custom transition-all duration-300">
                  <ChevronRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rotate-[-45deg] transition-transform duration-300" />
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-accent tracking-wider uppercase font-display">Completed Works</span>
                <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">ALL PROJECTS</span>
              </div>
            </a>
          </div>

        </main>

        {/* BOTTOM MARQUEE (TRUSTED BY FORWARD THINKING TEAMS) */}
        <footer className="relative z-20 w-full overflow-hidden border-t border-border-custom py-4 bg-[#020202]">
          <div className="animate-marquee flex gap-12 text-[10px] font-bold tracking-[0.2em] text-text-secondary uppercase select-none">
            {Array(12).fill("trusted by forward thinking teams").map((text, i) => (
              <span key={i} className="flex items-center gap-6 shrink-0">
                <span>{text}</span>
                <span className="text-accent">•</span>
              </span>
            ))}
          </div>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* 2. SECONDARY PORTFOLIO SECTIONS (Styled in carbon dark-first aesthetic) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-24">
        
        {/* ABOUT ME SECTION */}
        <section id="about" aria-labelledby="about-heading" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-accent animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">WHO I AM</span>
            </div>
            <h2 id="about-heading" className="text-2xl sm:text-3xl font-extrabold font-display leading-tight uppercase tracking-tight text-white">About Me</h2>
          </div>
          
          <div className="md:col-span-8 bento-card p-8 rounded-3xl bg-bg-card border border-border-custom flex flex-col gap-6">
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans">
              I am Monish Gowda GS, an aspiring Software Engineer with hands-on experience building web applications, AI-based solutions, and startup-style projects. Currently pursuing my B.E. in Computer Science and Business Systems (CSBS) at PES College of Engineering, Mandya. 
            </p>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed font-sans">
              I focus on combining strong technical programming skills, structural algorithms, and active team collaboration to ship robust and highly impactful software applications. My goal is to build digital products that combine visual elegance with structural integrity.
            </p>
            
            {/* Mini highlights */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border-custom">
              <div className="flex flex-col">
                <span className="text-accent font-extrabold text-xl font-display">2027</span>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider mt-1">B.E. Graduation</span>
              </div>
              <div className="flex flex-col">
                <span className="text-accent font-extrabold text-xl font-display">1st</span>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider mt-1">Swiss pairing chess engine</span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" aria-labelledby="services-heading" className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={18} className="text-accent" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">WHAT I OFFER</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service 1 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bento-card p-6 md:p-8 rounded-3xl bg-bg-card border border-border-custom flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-3 w-11 h-11 rounded-2xl bg-accent-light text-accent flex items-center justify-center border border-accent/25">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2 font-display">3D Immersive Frontends</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Designing and developing interactive frontend sites incorporating Spline, ThreeJS, and mouse parallax models for immersive experiences.
                </p>
              </div>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bento-card p-6 md:p-8 rounded-3xl bg-bg-card border border-border-custom flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-3 w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Code size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2 font-display">Full-Stack Development</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Building backend infrastructure, SQL architectures, and API frameworks utilizing Node.js, Express, and Supabase.
                </p>
              </div>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bento-card p-6 md:p-8 rounded-3xl bg-bg-card border border-border-custom flex flex-col gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="p-3 w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Terminal size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2 font-display">Interactive UI & Motion</h3>
                <p className="text-xs text-text-secondary leading-relaxed font-sans">
                  Crafting smooth micro-animations using Framer Motion and premium responsive styling structures built on Tailwind.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TECHNICAL TOOLKIT */}
        <section id="toolkit" aria-labelledby="toolkit-heading" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={18} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">MY ABILITIES</span>
            </div>
            <h2 id="toolkit-heading" className="text-2xl sm:text-3xl font-extrabold font-display leading-tight uppercase tracking-tight text-white">Technical Toolkit</h2>
          </div>
          
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Languages */}
            <div className="bento-card p-5 rounded-2xl bg-bg-card border border-border-custom flex flex-col gap-3">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider font-display">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {['C', 'C++', 'Python', 'JavaScript', 'HTML5', 'CSS3'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-bg-secondary rounded-lg text-xs font-semibold border border-border-custom hover:border-accent/40 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Frameworks & Libs */}
            <div className="bento-card p-5 rounded-2xl bg-bg-card border border-border-custom flex flex-col gap-3">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider font-display">Frameworks & Libraries</h3>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'Django', 'Express.js', 'Tailwind CSS'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-bg-secondary rounded-lg text-xs font-semibold border border-border-custom hover:border-accent/40 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend & DBs */}
            <div className="bento-card p-5 rounded-2xl bg-bg-card border border-border-custom flex flex-col gap-3">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider font-display">Backend & Databases</h3>
              <div className="flex flex-wrap gap-2">
                {['Node.js', 'MySQL', 'MongoDB', 'Supabase', 'PostgreSQL'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-bg-secondary rounded-lg text-xs font-semibold border border-border-custom hover:border-accent/40 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="bento-card p-5 rounded-2xl bg-bg-card border border-border-custom flex flex-col gap-3">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider font-display">Developer Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['Git & GitHub', 'Docker', 'VS Code', 'Copilot', 'Figma', 'ServiceNow'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-bg-secondary rounded-lg text-xs font-semibold border border-border-custom hover:border-accent/40 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Professional Skills */}
            <div className="bento-card p-5 rounded-2xl bg-bg-card border border-border-custom flex flex-col gap-3 sm:col-span-2">
              <h3 className="text-xs font-bold text-accent uppercase tracking-wider font-display">Professional Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Communication', 'Problem-Solving', 'Project Management', 'Teamwork & Collaboration', 'Time Management'].map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-accent/5 text-accent border border-accent/20 rounded-lg text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" aria-labelledby="projects-heading" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Code size={18} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">MY PORTFOLIO</span>
            </div>
            <h2 id="projects-heading" className="text-2xl sm:text-3xl font-extrabold font-display leading-tight uppercase tracking-tight text-white mb-2">Featured Work</h2>
            <span className="text-[10px] font-semibold text-text-secondary uppercase bg-bg-secondary border border-border-custom px-2 py-1 rounded-md">
              Real-time DB Connection
            </span>
          </div>

          <div className="md:col-span-8 flex flex-col gap-4">
            {loadingProjects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map(skeleton => (
                  <div key={skeleton} className="bento-card p-5 rounded-2xl h-48 bg-bg-card animate-pulse border border-border-custom flex flex-col justify-between">
                    <div className="flex flex-col gap-2">
                      <div className="h-4 bg-border-custom rounded w-2/3" />
                      <div className="h-3 bg-border-custom rounded w-full" />
                      <div className="h-3 bg-border-custom rounded w-5/6" />
                    </div>
                    <div className="h-6 bg-border-custom rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : errorProjects && projects.length === 0 ? (
              <div className="bento-card p-6 rounded-2xl border border-dashed border-red-500 bg-red-500/5 text-center text-xs">
                <AlertCircle size={24} className="mx-auto text-red-500 mb-2" />
                <span className="font-semibold text-text-primary block mb-1">Failed to query dynamic projects</span>
                <span className="text-text-secondary">Please check your backend connection or Supabase settings.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <motion.div 
                    key={project.id}
                    layoutId={`project-container-${project.id}`}
                    onClick={() => setSelectedProject(project)}
                    className="bento-card p-5 rounded-2xl bg-bg-card border border-border-custom hover:border-accent flex flex-col justify-between cursor-pointer group h-52 transition-all duration-300"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-bold font-display text-text-primary group-hover:text-accent transition-colors leading-tight">
                          {project.title}
                        </h3>
                        {project.title.includes('Chaduranga') && (
                          <span className="text-[9px] uppercase font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                            Publication
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed mt-1 font-sans">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.tech_stack.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[9px] bg-bg-secondary px-2 py-1 rounded text-text-secondary font-medium">
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <span className="text-[9px] bg-bg-secondary px-2 py-1 rounded text-accent font-bold">
                          +{project.tech_stack.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ACHIEVEMENTS & CERTIFICATIONS TIMELINE */}
        <section id="achievements" aria-labelledby="achievements-heading" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">CREDENTIALS</span>
            </div>
            <h2 id="achievements-heading" className="text-2xl sm:text-3xl font-extrabold font-display leading-tight uppercase tracking-tight text-white">Achievements</h2>
          </div>

          <div className="md:col-span-8 bento-card p-6 md:p-8 rounded-3xl bg-bg-card border border-border-custom flex flex-col gap-6">
            {/* Highlighted Publication Card */}
            <div className="p-5 rounded-2xl bg-accent/5 border border-accent/20 flex flex-col gap-2 relative overflow-hidden">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-accent">Research Publication (2026)</span>
              <h3 className="text-sm font-bold font-display leading-snug text-text-primary">
                "Chaduranga: An Automated Chess Tournament Management System"
              </h3>
              <p className="text-xs text-text-secondary leading-normal font-sans">
                Accepted for publication, establishing an automated round-pairing and live standings manager using a custom Swiss Pairing algorithm.
              </p>
            </div>

            {/* Timeline Items */}
            <div className="relative border-l border-border-custom pl-4 ml-2 flex flex-col gap-5">
              {[
                { title: "Introduction to Database Management System", issuer: "NPTEL", year: "2025" },
                { title: "Data Analytics with Python", issuer: "NPTEL", year: "2026" },
                { title: "Introduction to Artificial Intelligence (AI)", issuer: "Coursera", year: "2026" },
                { title: "Computer Networks", issuer: "Coursera", year: "2026" },
                { title: "Director of Editorial", issuer: "IEEE PESCE Student Branch", year: "Active" }
              ].map((cert, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-border-custom group-hover:bg-accent border-2 border-bg-card transition-colors" />
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-text-primary leading-tight group-hover:text-accent transition-colors">
                        {cert.title}
                      </h4>
                      <p className="text-[10px] text-text-secondary mt-0.5">{cert.issuer}</p>
                    </div>
                    <span className="text-[9px] font-bold text-text-secondary bg-bg-secondary px-2 py-0.5 rounded border border-border-custom shrink-0">
                      {cert.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION JOURNEY */}
        <section id="education" aria-labelledby="education-heading" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">JOURNEY</span>
            </div>
            <h2 id="education-heading" className="text-2xl sm:text-3xl font-extrabold font-display leading-tight uppercase tracking-tight text-white">Education</h2>
          </div>

          <div className="md:col-span-8 bento-card p-6 md:p-8 rounded-3xl bg-bg-card border border-border-custom flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  B.E. in Computer Science and Business Systems (CSBS)
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">PES College of Engineering, Mandya</p>
              </div>
              <span className="text-[9px] font-bold text-accent bg-accent/5 px-2 py-0.5 rounded border border-accent/20 shrink-0">
                2023 - 2027
              </span>
            </div>

            <hr className="border-border-custom" />

            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  12th Grade (PCMB)
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">Sadvidya P.U. College, Mandya</p>
              </div>
              <span className="text-[9px] font-bold text-text-secondary bg-bg-secondary px-2 py-0.5 rounded border border-border-custom shrink-0">
                Completed
              </span>
            </div>

            <hr className="border-border-custom" />

            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="text-sm font-bold font-display text-text-primary">
                  10th Grade
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">Manasa Education Trust, Besagarahalli, Mandya</p>
              </div>
              <span className="text-[9px] font-bold text-text-secondary bg-bg-secondary px-2 py-0.5 rounded border border-border-custom shrink-0">
                Completed
              </span>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" aria-labelledby="contact-heading" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail size={18} className="text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase font-display">LET'S CONNECT</span>
            </div>
            <h2 id="contact-heading" className="text-2xl sm:text-3xl font-extrabold font-display leading-tight uppercase tracking-tight text-white mb-6">Drop a Message</h2>

            <div className="flex flex-col gap-4 font-sans bg-bg-card p-6 rounded-3xl border border-border-custom max-w-sm shadow-xl">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent" />
                <a href="mailto:geethamonishivu@gmail.com" className="text-xs text-text-secondary hover:text-accent transition-colors truncate">geethamonishivu@gmail.com</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent" />
                <a href="tel:+917259309729" className="text-xs text-text-secondary hover:text-accent transition-colors">+91 7259309729</a>
              </div>
              <div className="flex gap-2.5 mt-2 border-t border-border-custom pt-4">
                <a href="https://github.com/geethamonishivu" target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 rounded-xl bg-bg-secondary hover:bg-accent-light border border-border-custom hover:text-accent hover:border-accent/40 flex items-center justify-center gap-2 text-xs font-semibold transition-all">
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
                <a href="https://linkedin.com/in/monish-gowda-gs" target="_blank" rel="noopener noreferrer" className="flex-1 py-2 px-3 rounded-xl bg-bg-secondary hover:bg-accent-light border border-border-custom hover:text-accent hover:border-accent/40 flex items-center justify-center gap-2 text-xs font-semibold transition-all">
                  <Linkedin size={14} />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 bento-card p-6 md:p-8 rounded-3xl bg-bg-card border border-border-custom shadow-2xl">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 font-sans">
              {/* Spam Protection Honeypot field */}
              <div className="hidden">
                <label htmlFor="website">Leave this field blank</label>
                <input 
                  type="text" 
                  id="website" 
                  name="website" 
                  value={formData.website} 
                  onChange={handleInputChange} 
                  autoComplete="off" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="bg-bg-secondary border border-border-custom focus:border-accent text-xs rounded-xl p-3.5 outline-none text-text-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email} 
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="bg-bg-secondary border border-border-custom focus:border-accent text-xs rounded-xl p-3.5 outline-none text-text-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-bold text-text-secondary uppercase tracking-wider">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  required 
                  value={formData.message} 
                  onChange={handleInputChange}
                  placeholder="Hi Monish, I'd love to connect regarding..."
                  className="bg-bg-secondary border border-border-custom focus:border-accent text-xs rounded-xl p-3.5 outline-none text-text-primary resize-none transition-colors"
                />
              </div>

              {/* Form submit status indicators */}
              <AnimatePresence mode="wait">
                {formStatus === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-semibold"
                  >
                    <CheckCircle2 size={16} />
                    <span>Your message has been sent successfully. I will get back to you soon!</span>
                  </motion.div>
                )}

                {formStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2 font-semibold"
                  >
                    <AlertCircle size={16} />
                    <span>{formError || 'Failed to submit form. Please try again.'}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={formStatus === 'submitting'}
                className="self-end px-7 py-3 bg-white text-black hover:bg-accent hover:text-white disabled:bg-white/40 text-xs font-extrabold uppercase rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/5 active:scale-95 duration-200"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* BOTTOM METADATA / VISITOR DISPLAY */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border-custom pt-8 gap-4 font-sans text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Monish Gowda GS. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-bg-card px-3 py-1.5 rounded-full border border-border-custom">
              <Eye size={14} className="text-accent" />
              <span>Total views: <strong className="text-white ml-0.5">{visitorsCount !== null ? visitorsCount.toLocaleString() : '...'}</strong></span>
            </span>
            <span className="flex items-center gap-1">
              <Code size={11} className="text-accent" />
              <span>React + Node + Tailwind v4</span>
            </span>
          </div>
        </div>

      </div>

      {/* PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              layoutId={`project-container-${selectedProject.id}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-card border border-border-custom w-full max-w-xl rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
            >
              
              <button 
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2.5 rounded-full bg-bg-secondary hover:bg-accent/15 hover:text-accent border border-border-custom text-text-secondary transition-all"
              >
                <X size={15} />
              </button>

              <div className="flex flex-col gap-3 font-sans">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-display text-text-primary pr-8 leading-tight">
                    {selectedProject.title}
                  </h3>
                  {selectedProject.title.includes('Chaduranga') && (
                    <span className="text-[9px] uppercase font-bold bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                      Publication
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedProject.tech_stack.map((tech, idx) => (
                    <span key={idx} className="text-[9px] bg-bg-secondary border border-border-custom px-2.5 py-1 rounded text-text-secondary font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Project Image Mockup */}
              <div className="w-full h-48 rounded-2xl overflow-hidden relative border border-border-custom bg-bg-secondary">
                <img 
                  src={selectedProject.image_url} 
                  alt={selectedProject.title}
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500" 
                />
              </div>

              <div className="flex flex-col gap-4 font-sans">
                <div>
                  <h4 className="text-[10px] uppercase font-extrabold text-accent tracking-wider font-display mb-1.5">Description</h4>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed font-sans">
                    {selectedProject.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-extrabold text-accent tracking-wider font-display mb-1.5">Key Highlights</h4>
                  <ul className="flex flex-col gap-1.5">
                    {selectedProject.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-text-secondary font-sans">
                        <ChevronRight size={14} className="text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 mt-4 border-t border-border-custom pt-4">
                <a 
                  href={selectedProject.github_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-full border border-border-custom hover:border-accent/40 bg-bg-secondary hover:bg-accent-light flex items-center justify-center gap-2 text-xs font-bold text-text-primary hover:text-accent transition-all"
                >
                  <Github size={15} />
                  <span>View Source Code</span>
                </a>
                <a 
                  href={selectedProject.live_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-accent/15 hover:shadow-accent/30 transition-all"
                >
                  <ExternalLink size={15} />
                  <span>Live Demo</span>
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
