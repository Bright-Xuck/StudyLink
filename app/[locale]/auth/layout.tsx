import { GraduationCap, BookOpen, Users, Brain } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-[var(--color-primary)] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-white" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-white" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-[var(--radius)] bg-[var(--color-accent)] flex items-center justify-center">
              <GraduationCap size={28} className="text-[var(--color-accent-foreground)]" />
            </div>
            <span className="text-2xl font-semibold">StudyLink</span>
          </div>

          {/* Main Message */}
          <div className="space-y-6">
            <h1 className="text-4xl xl:text-5xl font-semibold leading-tight text-balance">
              Master Your Studies with Confidence
            </h1>
            <p className="text-lg text-white/70 max-w-md">
              Join thousands of students who are achieving their academic goals through collaborative learning.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <FeatureItem
                icon={<BookOpen size={20} />}
                title="Quality Courses"
                description="Expert-led content"
              />
              <FeatureItem
                icon={<Users size={20} />}
                title="Study Groups"
                description="Learn together"
              />
              <FeatureItem
                icon={<Brain size={20} />}
                title="AI Assistant"
                description="Smart help"
              />
              <FeatureItem
                icon={<GraduationCap size={20} />}
                title="Certificates"
                description="Prove your skills"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-semibold">50K+</p>
              <p className="text-sm text-white/60">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">200+</p>
              <p className="text-sm text-white/60">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-semibold">95%</p>
              <p className="text-sm text-white/60">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[var(--color-background)]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-white/10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-white/60">{description}</p>
      </div>
    </div>
  );
}
