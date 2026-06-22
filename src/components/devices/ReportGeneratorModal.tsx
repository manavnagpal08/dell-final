'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { Device } from '@/types';

interface ReportGeneratorModalProps {
  device: Device;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportGeneratorModal({ device, open, onOpenChange }: ReportGeneratorModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    // Generate report and prepare for download
    setTimeout(() => {
      setIsGenerating(false);
      setIsDone(true);
      
      // Reset after a delay
      setTimeout(() => {
        setIsDone(false);
        onOpenChange(false);
      }, 3000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-slate-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <FileText className="h-5 w-5 text-blue-600" />
            Generate Device Report
          </DialogTitle>
          <DialogDescription>
            Download a comprehensive AI-generated health report for {device.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 my-4 space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">Report Contents:</h4>
          <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-4">
            <li>Device Information & Telemetry Summary</li>
            <li>Health Score Trends (Last 30 Days)</li>
            <li>AI Failure Predictions & Reasoning</li>
            <li>Recommended Maintenance Actions</li>
            <li>Estimated Business Impact</li>
          </ul>
        </div>

        <DialogFooter className="sm:justify-between flex-row items-center">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isGenerating}>Cancel</Button>
          <Button 
            onClick={handleDownload} 
            disabled={isGenerating || isDone}
            className={`${isDone ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-primary hover:bg-primary/90'} text-white min-w-[140px]`}
          >
            {isGenerating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : isDone ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" /> Ready to Save</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> Export PDF</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
