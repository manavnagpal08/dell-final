'use client';

import { useState } from 'react';
import { Device } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, MapPin, Hash, CalendarPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeviceInfoCardProps {
  device: Device;
}

export function DeviceInfoCard({ device }: DeviceInfoCardProps) {
  const [scheduled, setScheduled] = useState(false);

  const handleSchedule = () => {
    setScheduled(true);
    setTimeout(() => setScheduled(false), 3000);
  };

  return (
    <Card className="shadow-sm md:col-span-1 flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-base">Device Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Server className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm text-muted-foreground">{device.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Vendor / Model</p>
            <p className="text-sm text-muted-foreground">{device.vendor} {device.model}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Location</p>
            <p className="text-sm text-muted-foreground">{device.location}</p>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0 mt-auto">
        <Button 
          onClick={handleSchedule}
          disabled={scheduled}
          variant="outline" 
          className={`w-full font-medium transition-all ${
            scheduled 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50' 
              : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          {scheduled ? (
            <><CheckCircle2 className="h-4 w-4 mr-2" /> Ticket Created</>
          ) : (
            <><CalendarPlus className="h-4 w-4 mr-2" /> Schedule AI Maintenance</>
          )}
        </Button>
      </div>
    </Card>
  );
}
