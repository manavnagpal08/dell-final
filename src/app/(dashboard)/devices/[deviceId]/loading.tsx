import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DeviceDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-9 w-[150px]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-1">
          <CardHeader><Skeleton className="h-5 w-[150px]" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card className="shadow-sm md:col-span-2 h-[200px]">
          <CardHeader><Skeleton className="h-5 w-[200px]" /></CardHeader>
          <CardContent><Skeleton className="h-[100px] w-full" /></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-7 w-[200px]" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-sm h-[240px]">
                <CardHeader><Skeleton className="h-4 w-[100px]" /></CardHeader>
                <CardContent><Skeleton className="h-[150px] w-full" /></CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <Card className="shadow-sm h-[400px]">
            <CardHeader><Skeleton className="h-5 w-[200px]" /></CardHeader>
            <CardContent><Skeleton className="h-[300px] w-full" /></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
