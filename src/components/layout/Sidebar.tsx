'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Server, AlertCircle, Activity, ShieldCheck,
  Briefcase, DollarSign, BrainCircuit, AlertTriangle, LineChart,
  Link as LinkIcon, Settings, Zap, LogOut, ChevronDown, Network, UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationGroups = [
  {
    title: 'Mission Control',
    icon: LayoutDashboard,
    items: [
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Executive View', href: '/executive' },
      { title: 'Analytics Core', href: '/analytics' },
    ]
  },
  {
    title: 'Operations',
    icon: Server,
    items: [
      { title: 'Hardware Fleet', href: '/devices' },
      { title: 'Map Overview', href: '/map' },
      { title: 'Integrations', href: '/integrations' },
    ]
  },
  {
    title: 'System Health',
    icon: Activity,
    items: [
      { title: 'Risk Forecasts', href: '/predictions' },
      { title: 'Action Recommendations', href: '/recommendations' },
      { title: 'Decision Audits', href: '/explainability' },
    ]
  },
  {
    title: 'Monitoring',
    icon: Activity,
    items: [
      { title: 'Alert Command', href: '/alerts' },
    ]
  }
];

const bottomNav = [
  { title: 'System Settings', href: '/settings', icon: Settings },
];

function NavGroup({ 
  group, 
  pathname, 
  onClose 
}: { 
  group: typeof navigationGroups[0], 
  pathname: string, 
  onClose?: () => void 
}) {
  const isActiveGroup = group.items.some(item => pathname.startsWith(item.href));
  const [isOpen, setIsOpen] = useState(isActiveGroup);

  return (
    <div className="mb-3 px-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent",
          isOpen || isActiveGroup 
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]" 
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        <div className="flex items-center gap-3">
          <group.icon className={cn("h-4 w-4", isOpen || isActiveGroup ? "text-blue-500" : "text-muted-foreground")} />
          <span className="tracking-wide">{group.title}</span>
        </div>
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isOpen ? "rotate-180 text-blue-500" : "text-slate-600"
          )} 
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-1 pl-4 pr-1 space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "block px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-300 relative group",
                      isActive
                        ? "text-white bg-blue-600 shadow-md shadow-blue-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                    )}
                  >
                    <span className={cn("relative z-10", isActive ? "" : "group-hover:translate-x-1 transition-transform inline-block")}>
                      {item.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState('admin@enterprise.com');

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )tenant=([^;]+)'));
    if (match && match[2]) {
      setEmail(decodeURIComponent(match[2]));
    }
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = 'tenant=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex h-full w-[280px] flex-col border-r border-border bg-background/95 backdrop-blur-2xl shadow-2xl relative z-50 overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[80px] pointer-events-none" />
      
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-border bg-transparent shrink-0 relative z-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Server className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-foreground">VYOM <span className="text-blue-600 dark:text-blue-500">SYSTEM</span></span>
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-0.5">Mission Control</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col overflow-y-auto py-6 custom-scrollbar relative z-10">
        {navigationGroups.map((group) => (
          <NavGroup key={group.title} group={group} pathname={pathname} onClose={onClose} />
        ))}
        
        <div className="mt-auto pt-6 px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4 mx-3" />
          {bottomNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 mx-1 rounded-xl text-sm font-semibold transition-all duration-300 border border-transparent",
                  isActive 
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-500/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-500" : "text-muted-foreground")} />
                {item.title}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30 relative z-10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-secondary/50 border border-border hover:border-blue-500/30 hover:bg-secondary transition-all group">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold bg-blue-600 border border-blue-500/50 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]">
            <UserPlus className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">Admin User</p>
            <p className="text-[11px] font-medium text-muted-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
            title="Secure Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
