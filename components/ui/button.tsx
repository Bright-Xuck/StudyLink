import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-2xl border font-medium transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-primary-foreground border-transparent shadow-sm hover:shadow-md hover:opacity-95 active:translate-y-0.5': variant === 'default',
            'bg-destructive text-destructive-foreground border-transparent shadow-sm hover:shadow-md hover:opacity-95 active:translate-y-0.5': variant === 'destructive',
            'border border-border bg-background text-foreground hover:border-primary hover:bg-primary/10 hover:text-foreground': variant === 'outline',
            'bg-secondary text-secondary-foreground border-transparent shadow-sm hover:shadow-md hover:opacity-95 active:translate-y-0.5': variant === 'secondary',
            'bg-transparent text-foreground hover:bg-muted hover:text-foreground': variant === 'ghost',
          },
          {
            'h-11 px-6': size === 'default',
            'h-9 px-4 text-sm': size === 'sm',
            'h-12 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };