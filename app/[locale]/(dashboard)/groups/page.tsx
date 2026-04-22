'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Avatar, AvatarGroup } from '@/components/ui';
import { GroupCard } from '@/components/features/GroupCard';
import { Search, Plus, Users, Calendar, MessageSquare } from 'lucide-react';

const mockGroups = [
  {
    id: '1',
    name: 'React Study Circle',
    description: 'Weekly study sessions covering React fundamentals to advanced patterns. Great for beginners and intermediate developers.',
    members: 145,
    subject: 'React',
    isActive: true,
    nextSession: 'Today, 3:00 PM',
    memberAvatars: ['', '', '', '', ''],
    isJoined: true,
  },
  {
    id: '2',
    name: 'Node.js Masters',
    description: 'Advanced Node.js discussions, best practices, and code reviews. Focus on backend architecture and performance.',
    members: 89,
    subject: 'Backend',
    isActive: false,
    nextSession: 'Tomorrow, 5:00 PM',
    memberAvatars: ['', '', '', ''],
    isJoined: true,
  },
  {
    id: '3',
    name: 'Web Dev Bootcamp',
    description: 'Full stack web development journey from HTML to deployment. Perfect for career changers and new developers.',
    members: 234,
    subject: 'Full Stack',
    isActive: true,
    nextSession: 'Wed, 2:00 PM',
    memberAvatars: ['', '', '', '', '', ''],
    isJoined: false,
  },
  {
    id: '4',
    name: 'TypeScript Pro',
    description: 'Deep dive into TypeScript features, patterns, and best practices for type-safe applications.',
    members: 67,
    subject: 'TypeScript',
    isActive: false,
    nextSession: 'Thu, 4:00 PM',
    memberAvatars: ['', '', ''],
    isJoined: false,
  },
  {
    id: '5',
    name: 'Python Data Science',
    description: 'Learn data analysis, visualization, and machine learning with Python. Hands-on projects included.',
    members: 189,
    subject: 'Data Science',
    isActive: false,
    nextSession: 'Fri, 6:00 PM',
    memberAvatars: ['', '', '', '', ''],
    isJoined: false,
  },
  {
    id: '6',
    name: 'AWS Cloud Champions',
    description: 'Master cloud computing with AWS. Prepare for certifications and build real-world projects.',
    members: 112,
    subject: 'Cloud',
    isActive: true,
    nextSession: 'Today, 7:00 PM',
    memberAvatars: ['', '', '', ''],
    isJoined: false,
  },
];

export default function GroupsPage() {
  const t = useTranslations('groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'discover'>('all');

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'joined' && group.isJoined) ||
      (filter === 'discover' && !group.isJoined);
    return matchesSearch && matchesFilter;
  });

  const myGroups = mockGroups.filter((g) => g.isJoined);
  const upcomingSessions = myGroups
    .filter((g) => g.nextSession)
    .sort((a, b) => (a.nextSession || '').localeCompare(b.nextSession || ''));

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-foreground)] mb-1">
              {t('title')}
            </h1>
            <p className="text-[var(--color-foreground-muted)]">
              {t('subtitle')}
            </p>
          </div>
          <Button variant="primary" icon={<Plus size={18} />}>
            {t('create')}
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Groups List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]"
                  />
                  <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  {(['all', 'joined', 'discover'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 text-sm rounded-[var(--radius-sm)] transition-colors ${
                        filter === f
                          ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                          : 'bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                      }`}
                    >
                      {f === 'all' && 'All Groups'}
                      {f === 'joined' && t('your_groups')}
                      {f === 'discover' && t('discover')}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Groups Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  {...group}
                  onJoin={() => console.log('Join', group.name)}
                />
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <Card className="text-center py-12">
                <p className="text-[var(--color-foreground-muted)]">
                  No groups found matching your criteria.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Sessions */}
            <Card padding="none">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle as="h2">{t('upcoming_sessions')}</CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center gap-3 p-3 rounded-[var(--radius)] bg-[var(--color-background)] border border-[var(--color-border)]"
                      >
                        <div
                          className={`w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center ${
                            group.isActive
                              ? 'bg-[var(--color-success-light)] text-green-700'
                              : 'bg-[var(--color-background-alt)] text-[var(--color-foreground-muted)]'
                          }`}
                        >
                          <Calendar size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
                            {group.name}
                          </p>
                          <p className="text-xs text-[var(--color-foreground-muted)]">
                            {group.nextSession}
                          </p>
                        </div>
                        {group.isActive && (
                          <Badge variant="success" size="sm">Live</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--color-foreground-muted)]">
                    No upcoming sessions. Join a group to get started!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardContent>
                <h3 className="font-medium text-[var(--color-foreground)] mb-4">
                  Your Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-foreground-muted)]">
                      Groups Joined
                    </span>
                    <span className="font-medium text-[var(--color-foreground)]">
                      {myGroups.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-foreground-muted)]">
                      Sessions This Week
                    </span>
                    <span className="font-medium text-[var(--color-foreground)]">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-foreground-muted)]">
                      Messages Sent
                    </span>
                    <span className="font-medium text-[var(--color-foreground)]">47</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
