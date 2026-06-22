import { Device } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

interface ActiveRiskCardProps {
  device: Device;
}

export function ActiveRiskCard({ device }: ActiveRiskCardProps) {
  if (!device.predicted_failure_type) return null;

  return (
    <Card className="shadow-sm md:col-span-2 border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-base text-destructive flex items-center">
          <ShieldAlert className="mr-2 h-5 w-5" /> Active Risk Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-slate-700">Predicted Failure</p>
            <p className="text-xl font-bold text-destructive">{device.predicted_failure_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">Estimated Time to Failure</p>
            <p className="text-xl font-bold text-amber-600">{device.days_remaining} days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
