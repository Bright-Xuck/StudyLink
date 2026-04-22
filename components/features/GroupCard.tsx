'use client';

import { Link } from '@/navigation';
import { Card, CardContent, Badge, Button, Avatar, AvatarGroup } from '@/components/ui';
import { Users, Calendar, MessageSquare } from 'lucide-react';

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  members: number;
  subject: string;
  isActive?: boolean;
  nextSession?: string;
  memberAvatars?: string[];
  isJoined?: boolean;
  onJoin?: () => void;
}

export function GroupCard({
  id,
  name,
  description,
  members,
  subject,
  isActive = false,
  nextSession,
  memberAvatars = [],
  isJoined = false,
  onJoin,
}: GroupCardProps) {
  return (
    <Card hover className="flex flex-col h-full" padding="none">
      <CardContent className="flex-1 flex flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[var(--color-foreground)]">{name}</h3>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              )}
            </div>
            <Badge variant="default" size="sm">{subject}</Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--color-foreground-muted)] mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[var(--color-foreground-muted)] mb-4">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {members} members
          </span>
          {nextSession && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {nextSession}
            </span>
          )}
        </div>

        {/* Member Avatars */}
        {memberAvatars.length > 0 && (
          <div className="mb-4">
            <AvatarGroup max={4}>
              {memberAvatars.map((avatar, index) => (
                <Avatar key={index} name={`Member ${index + 1}`} size="sm" />
              ))}
            </AvatarGroup>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-[var(--color-border)]">
          {isJoined ? (
            <>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                href={`/groups/${id}`}
                icon={<MessageSquare size={14} />}
              >
                Open Chat
              </Button>
              <Button variant="secondary" size="sm" href={`/groups/${id}`}>
                View
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                href={`/groups/${id}`}
              >
                View Details
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={onJoin}
              >
                Join Group
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
