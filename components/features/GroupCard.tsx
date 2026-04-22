'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  members: number;
  subject: string;
  onJoin?: () => void;
}

export function GroupCard({ id, name, description, members, subject, onJoin }: GroupCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-[var(--color-foreground-muted)] mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <Badge variant="default">{subject}</Badge>
          <span className="text-sm text-[var(--color-foreground-muted)]">{members} members</span>
        </div>
      </CardContent>
      <div className="p-6 pt-0">
        <Button variant="primary" size="sm" className="w-full" onClick={onJoin}>
          Join Group
        </Button>
      </div>
    </Card>
  );
}
