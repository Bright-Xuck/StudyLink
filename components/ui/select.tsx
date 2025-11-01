import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import {
  createContext,
  forwardRef,
  HTMLAttributes,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';

// Context for Select state
interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within Select');
  }
  return context;
};

// Select Root
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
}

const Select = ({ value, onValueChange, defaultValue = '', children }: SelectProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const currentValue = value !== undefined ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
      }}
    >
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

// Select Trigger
interface SelectTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground transition-all duration-200',
          'hover:border-primary/50 hover:shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'border-primary ring-2 ring-ring ring-offset-2',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown 
          className={cn(
            'h-4 w-4 opacity-50 transition-all duration-300 ease-out',
            open && 'rotate-180 opacity-100'
          )} 
        />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

// Select Value
interface SelectValueProps {
  placeholder?: string;
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = useSelectContext();
  
  // Store the display values mapping
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    // Find the selected item's text content from the DOM
    const findDisplayValue = () => {
      const selectItems = document.querySelectorAll(`[data-value="${value}"]`);
      if (selectItems.length > 0) {
        const textContent = selectItems[0].textContent?.trim() || '';
        setDisplayValue(textContent);
      }
    };

    if (value) {
      // Small delay to ensure DOM is rendered
      const timer = setTimeout(findDisplayValue, 0);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  return (
    <span className={cn(
      'block truncate',
      value ? 'text-foreground' : 'text-muted-foreground'
    )}>
      {value && displayValue ? displayValue : placeholder}
    </span>
  );
};

// Select Content
interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, ...props }, _ref) => {
    const { open, setOpen } = useSelectContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
      if (open) {
        setShouldRender(true);
        // Small delay to trigger animation
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      } else {
        setIsAnimating(false);
        // Wait for animation to finish before unmounting
        const timer = setTimeout(() => {
          setShouldRender(false);
        }, 200);
        return () => clearTimeout(timer);
      }
    }, [open]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          const trigger = contentRef.current.previousElementSibling;
          if (trigger && !trigger.contains(event.target as Node)) {
            setOpen(false);
          }
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
        };
      }
    }, [open, setOpen]);

    if (!shouldRender) return null;

    return (
      <div
        ref={contentRef}
        className={cn(
          'absolute z-50 mt-2 max-h-96 w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg transition-all duration-200 ease-out',
          isAnimating 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-2 scale-95',
          className
        )}
        {...props}
      >
        <div className="p-1 overflow-auto max-h-[inherit]">{children}</div>
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

// Select Item
interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelectContext();
    const isSelected = selectedValue === value;

    return (
      <div
        ref={ref}
        data-value={value}
        onClick={() => onValueChange(value)}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-all duration-150 ease-in-out',
          'hover:bg-accent hover:text-accent-foreground hover:pl-9',
          isSelected && 'bg-accent/50 font-medium',
          className
        )}
        {...props}
      >
        <span className={cn(
          'absolute left-2 flex h-4 w-4 items-center justify-center transition-all duration-200',
          isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        )}>
          <Check className="h-4 w-4 text-primary" />
        </span>
        <span className="transition-colors duration-150">{children}</span>
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

// Select Group (optional, for grouping items)
interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);
SelectGroup.displayName = 'SelectGroup';

// Select Label (for section headers)
interface SelectLabelProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'py-1.5 pl-2 pr-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide',
          'sticky top-0 bg-popover/95 backdrop-blur-sm z-10',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectLabel.displayName = 'SelectLabel';

// Select Separator (optional visual divider)
const SelectSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-border', className)}
        {...props}
      />
    );
  }
);
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};