'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { AIAssistantWidget } from '@/components/shared/AIAssistantWidget';
import { CriticalActionCall } from '@/components/shared/CriticalActionCall';
import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlobalRealtimeManager } from '@/components/layout/GlobalRealtimeManager';

export function AppShell({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop static, Mobile absolute sliding */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
        {/* Mobile Close Button (inside sidebar container) */}
        {isMobileMenuOpen && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 lg:hidden text-slate-500 hover:bg-slate-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      <AIAssistantWidget />
      <CriticalActionCall />
      <GlobalRealtimeManager />
    </div>
  );
}
