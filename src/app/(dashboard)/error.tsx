'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-sm border-destructive/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl">Something went wrong!</CardTitle>
          <CardDescription>
            We encountered an unexpected error while loading the dashboard data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pt-2">
          <Button onClick={() => reset()} variant="outline" className="w-full">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
