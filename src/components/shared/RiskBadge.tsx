import { Badge } from '@/components/ui/badge';
import { RiskLevel } from '@/types';

export function RiskBadge({ level, score }: { level: RiskLevel; score?: number }) {
  if (level === 'Critical') {
    return (
      <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 relative">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
        </span>
        {score ? `Score: ${score}` : level}
      </Badge>
    );
  }
  if (level === 'Warning') {
    return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">{level}{score ? ` (${score})` : ''}</Badge>;
  }
  return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{level}{score ? ` (${score})` : ''}</Badge>;
}
