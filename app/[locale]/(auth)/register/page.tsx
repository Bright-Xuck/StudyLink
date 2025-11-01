'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { registerUser } from "@/lib/actions/auth.actions";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/contexts/AuthProvider";

const DEPARTMENTS = [
  // Faculty of Science
  { value: "Computer Science", label: "Computer Science", faculty: "Faculty of Science" },
  { value: "Mathematics", label: "Mathematics", faculty: "Faculty of Science" },
  { value: "Physics", label: "Physics", faculty: "Faculty of Science" },
  { value: "Chemistry", label: "Chemistry", faculty: "Faculty of Science" },
  { value: "Microbiology", label: "Microbiology", faculty: "Faculty of Science" },
  { value: "Biochemistry", label: "Biochemistry", faculty: "Faculty of Science" },
  { value: "Geology", label: "Geology", faculty: "Faculty of Science" },
  
  // Faculty of Social & Management Sciences
  { value: "Economics", label: "Economics", faculty: "Faculty of Social & Management Sciences" },
  { value: "Management", label: "Management", faculty: "Faculty of Social & Management Sciences" },
  { value: "Sociology", label: "Sociology", faculty: "Faculty of Social & Management Sciences" },
  { value: "Psychology", label: "Psychology", faculty: "Faculty of Social & Management Sciences" },
  
  // Faculty of Arts
  { value: "English", label: "English", faculty: "Faculty of Arts" },
  { value: "French", label: "French", faculty: "Faculty of Arts" },
  { value: "Linguistics", label: "Linguistics", faculty: "Faculty of Arts" },
  
  // Faculty of Education
  { value: "Curriculum Studies", label: "Curriculum Studies", faculty: "Faculty of Education" },
  { value: "Educational Psychology", label: "Educational Psychology", faculty: "Faculty of Education" },
  
  // Faculty of Health Sciences
  { value: "Nursing", label: "Nursing", faculty: "Faculty of Health Sciences" },
  { value: "Public Health", label: "Public Health", faculty: "Faculty of Health Sciences" },
  
  // Faculty of Engineering
  { value: "Civil Engineering", label: "Civil Engineering", faculty: "Faculty of Engineering" },
  { value: "Electrical Engineering", label: "Electrical Engineering", faculty: "Faculty of Engineering" },
  
  // General
  { value: "General Studies", label: "General Studies", faculty: "General" },
  { value: "All Departments", label: "All Departments", faculty: "General" },
];

export default function RegisterPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }));
    // Clear error when user selects
    if (errors.department) {
      setErrors((prev) => ({ ...prev, department: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError('');
    setErrors({});

    try {
      const result = await registerUser(formData, locale);

      if (result.success) {
        await refreshUser()
        // Redirect to dashboard
        router.push(`/dashboard`);
      } else {
        setServerError(result.error || 'An error occurred');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      setServerError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Group departments by faculty
  const groupedDepartments = DEPARTMENTS.reduce((acc, dept) => {
    if (!acc[dept.faculty]) {
      acc[dept.faculty] = [];
    }
    acc[dept.faculty].push(dept);
    return acc;
  }, {} as Record<string, typeof DEPARTMENTS>);

  return (
    <div className="w-full max-w-md space-y-8 py-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground">{t('registerTitle')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('hasAccount')}{' '}
          <Link href={`/login`} className="text-primary hover:underline font-medium">
            {t('signIn')}
          </Link>
        </p>
      </div>

      {/* Form */}
      <form 
        className="space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-border/50" 
        onSubmit={handleSubmit}
      >
        {serverError && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="nkengbeza123@gmail.com"
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+237 123 456 789"
              className="mt-1"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <Label htmlFor="department">{t('department')}</Label>
            <Select value={formData.department} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedDepartments).map(([faculty, depts]) => (
                  <div key={faculty}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {faculty}
                    </div>
                    {depts.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="mt-1 text-sm text-destructive">{errors.department}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {locale === 'fr' ? 'Inscription...' : 'Registering...'}
            </>
          ) : (
            t('registerButton')
          )}
        </Button>
      </form>
    </div>
  );
}