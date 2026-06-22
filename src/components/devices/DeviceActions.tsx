'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wrench, FileDown } from 'lucide-react';
import { ReportGeneratorModal } from './ReportGeneratorModal';
import { Device } from '@/types';

export function DeviceActions({ device }: { device: Device }) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="bg-secondary/50 border-border hover:bg-secondary">
          <Wrench className="mr-2 h-4 w-4" /> Schedule Maintenance
        </Button>
        <Button 
          variant="default" 
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
          onClick={() => setIsReportModalOpen(true)}
        >
          <FileDown className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>

      <ReportGeneratorModal 
        device={device} 
        open={isReportModalOpen} 
        onOpenChange={setIsReportModalOpen} 
      />
    </>
  );
}
