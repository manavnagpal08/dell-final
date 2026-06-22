'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Eye, EyeOff, ShieldAlert, Cpu, BrainCircuit, Network, Zap, UserPlus, LogIn, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Floating particle canvas for a subtle, professional background
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
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 10000);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          color: `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})`
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

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 120)})`;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none z-0" />;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Attempting ${isSignUp ? 'signup' : 'login'} for ${email}...`);
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const isPlaceholder = supabaseUrl.includes('your-project');

        if (isPlaceholder) {
        // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (isSignUp) {
            document.cookie = `tenant=${encodeURIComponent(email)}; path=/`;
            window.location.href = '/dashboard';
            return;
          }
        
        // Mock successful login
        document.cookie = `tenant=${encodeURIComponent(email)}; path=/`;
        console.log("Mock session established. Redirecting to dashboard...");
        window.location.href = '/dashboard';
        return;
      }

      const supabase = createClient();
      
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName }
          }
        });
        
        console.log("Signup response:", { data, error: signUpError });
        
        if (signUpError) {
          throw new Error(signUpError.message);
        }
        
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error("An account with this email already exists.");
        }
        
        // Hackathon immediate redirect bypasses email verification
        // if (!data.session) { ... }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        console.log("Login response:", { data, error: signInError });
        
        if (signInError) {
          throw new Error(signInError.message);
        }
        
        if (!data.session) {
          throw new Error("Authentication failed. No session returned.");
        }
      }

      document.cookie = `tenant=${encodeURIComponent(email)}; path=/`;
      console.log("Session established. Redirecting to dashboard...");
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Fallback for Failed to fetch
      if (err.message === 'Failed to fetch') {
        console.log("Failed to fetch from Supabase. Falling back to mock authentication.");
        document.cookie = `tenant=${encodeURIComponent(email)}; path=/`;
        window.location.href = '/dashboard';
      } else {
        setError(err.message || 'Authentication failed');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#030712] relative font-sans text-slate-200">
      <ParticleCanvas />
      
      {/* Decorative ambient background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none z-0" />

      {/* ── Left: Auth Form ── */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 lg:p-16 relative z-10 border-r border-white/5 bg-black/40 backdrop-blur-md"
      >
        <div className="w-full max-w-sm space-y-8 relative">
          
          {/* Brand */}
          <div className="text-left space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <BrainCircuit className="h-6 w-6 text-blue-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">VyomAi</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              {isSignUp ? 'Join the future of predictive infrastructure.' : 'Sign in to access your mission control.'}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6 relative">
            
            {/* Toggle tabs */}
            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5 relative z-10">
              <button 
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isSignUp ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isSignUp ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-5 relative z-10">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 overflow-hidden"
                  >
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Full Name</Label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-12 rounded-xl transition-all"
                      placeholder="Jane Doe"
                      required={isSignUp}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-12 rounded-xl transition-all"
                  placeholder="admin@enterprise.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Password</Label>
                  {!isSignUp && (
                    <button type="button" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/40 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500 h-12 rounded-xl pl-10 pr-10 transition-all"
                    placeholder={isSignUp ? 'Create a secure password' : 'Enter your password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] border border-blue-500/30 mt-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                {isLoading ? (
                  <span className="flex items-center gap-2 relative z-10">
                    <Cpu className="h-5 w-5 animate-spin" />
                    {isSignUp ? 'Provisioning Account...' : 'Authenticating...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-base relative z-10">
                    {isSignUp ? (
                      <><UserPlus className="h-5 w-5" /> Sign Up</>
                    ) : (
                      <><LogIn className="h-5 w-5" /> Log In</>
                    )}
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* ── Right: Premium Visual Hero ── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center z-10"
      >
        <div className="absolute inset-0 bg-blue-900/5 mix-blend-screen pointer-events-none" />
        <div className="relative z-20 max-w-xl text-center space-y-12 px-12">
          
          {/* Tagline Graphic */}
          <div className="space-y-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-widest uppercase backdrop-blur-md mb-4"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              Reliability Before Impact
            </motion.div>
            
            <h2 className="text-5xl font-black text-white leading-tight tracking-tight">
              Advanced <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                Hardware Intelligence
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
              Connect your infrastructure, stream live telemetry, and leverage advanced analytics to prevent server downtime before it ever happens.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/5 shadow-2xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all cursor-default">
                <Network className="h-7 w-7 text-blue-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telemetry</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/5 shadow-2xl hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all cursor-default">
                <Zap className="h-7 w-7 text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Predict</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="h-16 w-16 rounded-2xl bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/5 shadow-2xl hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all cursor-default">
                <ShieldAlert className="h-7 w-7 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prevent</span>
            </div>
          </div>
        </div>
        
        {/* Holographic glowing orb background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      </motion.div>
    </div>
  );
}
