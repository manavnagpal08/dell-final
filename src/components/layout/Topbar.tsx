'use client';

import { Menu, Bell, Search, Cpu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DataModeSelector } from '@/components/layout/DataModeSelector';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-20 shrink-0 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center lg:hidden">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2 text-muted-foreground hover:text-foreground hover:bg-secondary">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-lg group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
          <Input
            type="search"
            placeholder="Search neural predictions, alerts, hardware..."
            className="w-full bg-secondary/50 pl-11 pr-16 h-11 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-blue-500/50 rounded-full transition-all shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl + K</span>
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">


        <DataModeSelector />

        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl h-11 w-11 border border-transparent hover:border-border transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-4 ring-background shadow-[0_0_8px_#ef4444]" />
        </Button>


      </div>
    </header>
  );
}
