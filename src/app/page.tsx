'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Network, Zap, Shield, Activity, 
  ArrowRight, BrainCircuit, Database, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// --- Splash Screen (White Theme) ---
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px]" />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-6">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-blue-200 scale-150"
          />
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        
        <motion.h1 
          className="text-6xl font-black tracking-tighter text-slate-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          VyomAi
        </motion.h1>
        
        <motion.p 
          className="mt-4 tracking-[0.3em] text-blue-500 text-sm font-semibold uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          Intelligence Before Impact
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        className="absolute bottom-16 w-48 h-1 bg-slate-100 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
};

// --- Subtle Light Particle Canvas ---
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: any[] = [];
    
    const resize = () => { 
      canvas.width = window.innerWidth; 
      canvas.height = window.innerHeight; 
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 2 + 0.5,
          color: `rgba(59, 130, 246, ${Math.random() * 0.15 + 0.05})`
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// --- AI Core Graphic (Light Theme) ---
const AICoreGraphic = () => {
  return (
    <div className="relative w-full h-[520px] flex items-center justify-center mt-8">
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 pointer-events-none" />
      
      {/* Ambient glows */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-100 rounded-full blur-[80px] z-0"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-100 rounded-full blur-[100px] z-0"
      />

      {/* Rings */}
      <motion.div 
        animate={{ rotateX: 65, rotateZ: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-200 z-10 [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-300" />
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
      </motion.div>
      <motion.div 
        animate={{ rotateX: 65, rotateZ: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-indigo-100 z-10 [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 rounded-full border-b-2 border-indigo-200" />
      </motion.div>

      {/* Center Core */}
      <motion.div
        animate={{ y: [-12, 12, -12] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-30 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-blue-200/40 blur-[30px] rounded-full" />
        <div className="relative w-36 h-36 rounded-2xl bg-white border border-blue-100 shadow-[0_8px_60px_rgba(59,130,246,0.2)] flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-xl border border-blue-100 border-t-blue-300"
          />
          <BrainCircuit className="w-16 h-16 text-blue-500 relative z-10" />
          <motion.div 
            animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 border-2 border-blue-300/60 rounded-2xl"
          />
        </div>
      </motion.div>

      {/* Floating Nodes */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 200;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.4;

        return (
          <motion.div
            key={i}
            animate={{ 
              x: [x, x + 10, x],
              y: [y, y + 10, y],
            }}
            transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6 rounded-xl bg-white border border-slate-100 shadow-md flex items-center justify-center z-20 hover:shadow-blue-100 hover:border-blue-200 transition-all"
          >
            <div className="absolute top-1/2 left-1/2 w-[180px] h-px bg-gradient-to-r from-blue-200 to-transparent -translate-y-1/2 origin-left pointer-events-none"
                 style={{ transform: `translateY(-50%) rotate(${Math.atan2(-y, -x)}rad)`, opacity: 0.4 }} />
            <div className="relative z-10">
              {i % 3 === 0 ? <Activity className="w-5 h-5 text-emerald-500" /> : 
               i % 3 === 1 ? <Shield className="w-5 h-5 text-indigo-400" /> :
                             <Database className="w-5 h-5 text-blue-400" />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- Main Page ---
export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-slate-800 overflow-x-hidden font-sans relative selection:bg-blue-100">
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <ParticleCanvas />
      
      {/* Subtle grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: showSplash ? -100 : 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="fixed top-0 inset-x-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-xl shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100 group-hover:bg-blue-100 transition-all">
              <BrainCircuit className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">VyomAi</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">Platform</a>
            <a href="#capabilities" className="hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#technology" className="hover:text-blue-600 transition-colors">Technology</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600 font-semibold hover:text-blue-600 hover:bg-blue-50">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 font-semibold text-white rounded-xl shadow-md hover:shadow-blue-200 transition-all px-5">
                Log In <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24">
        {/* HERO */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-start text-center px-6 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 30 : 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6 relative z-30"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold tracking-widest uppercase">
              <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              Intelligence Before Impact
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
              Hardware Management
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700">
                System
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Transform your enterprise infrastructure with advanced telemetry analysis. 
              Prevent downtime and deploy automated maintenance.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/login">
                <Button className="h-13 px-8 py-3.5 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-200 border border-blue-500 group transition-all">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="h-13 px-8 py-3.5 text-base font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all">
                <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                View Architecture
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 pt-4 flex-wrap">
              {['98% Accuracy', '30-day Prediction', 'Zero-downtime'].map(badge => (
                <div key={badge} className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Graphic */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showSplash ? 0 : 1, scale: showSplash ? 0.95 : 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="w-full relative z-20"
          >
            <AICoreGraphic />
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-28 relative z-30 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Platform Capabilities</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Next-Generation Capabilities</h2>
              <p className="text-slate-500 text-lg font-medium">Transition from reactive to proactive maintenance.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Network, title: "System Telemetry", desc: "Process millions of hardware data points in real-time using advanced algorithms to establish baseline health patterns.", accent: "blue" },
                { icon: Zap, title: "Predictive Failure", desc: "Identify micro-anomalies and predict component degradation up to 30 days before critical failure occurs.", accent: "indigo" },
                { icon: Shield, title: "Automated Prescriptions", desc: "Generate context-aware remediation scripts and automated workflows to mitigate risks instantly.", accent: "emerald" }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  className="group p-8 rounded-2xl bg-white border border-slate-100 transition-all duration-300 shadow-sm"
                >
                  <div className={`h-14 w-14 rounded-xl bg-${feature.accent === 'blue' ? 'blue' : feature.accent === 'indigo' ? 'indigo' : 'emerald'}-50 border border-${feature.accent === 'blue' ? 'blue' : feature.accent === 'indigo' ? 'indigo' : 'emerald'}-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 text-${feature.accent === 'blue' ? 'blue' : feature.accent === 'indigo' ? 'indigo' : 'emerald'}-500`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call To Action */}
        <section className="py-28 relative overflow-hidden bg-white border-t border-slate-100">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-3xl mx-auto px-6 relative z-10 text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900">
              Ready to elevate your infrastructure?
            </h2>
            <p className="text-xl text-slate-500 font-medium">Join enterprises leveraging VyomAi for zero-downtime operations.</p>
            <div className="pt-4">
              <Link href="/login">
                <Button className="h-14 px-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl hover:shadow-blue-200 border border-blue-500 hover:scale-105 transition-all">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-slate-100 bg-slate-50 relative z-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-black text-slate-800 tracking-tight">VyomAi</span>
            </div>
            <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} VYOMAI. Intelligence Before Impact.</p>
            <div className="flex items-center gap-6 text-sm font-semibold text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
