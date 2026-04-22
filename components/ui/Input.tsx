import { clsx } from "clsx";

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
};

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  name,
  id,
  className = "",
  icon,
  size = "md",
}: InputProps) {
  const inputId = id || name;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-foreground-muted)]">
            {icon}
          </span>
        )}
        <input
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={clsx(
            "w-full border rounded-[var(--radius-sm)]",
            "bg-[var(--color-background-elevated)] text-[var(--color-foreground)]",
            "placeholder:text-[var(--color-foreground-subtle)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-background-alt)]",
            sizeStyles[size],
            icon && "pl-10",
            error
              ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
              : "border-[var(--color-border)]"
          )}
        />
      </div>
      {hint && !error && (
        <p className="text-xs text-[var(--color-foreground-muted)]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  rows?: number;
}

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  name,
  id,
  className = "",
  rows = 4,
}: TextareaProps) {
  const textareaId = id || name;

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          {label}
          {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        rows={rows}
        className={clsx(
          "w-full px-4 py-2.5 border rounded-[var(--radius-sm)]",
          "bg-[var(--color-background-elevated)] text-[var(--color-foreground)]",
          "placeholder:text-[var(--color-foreground-subtle)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
          "transition-all duration-200 resize-none",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-background-alt)]",
          error
            ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
            : "border-[var(--color-border)]"
        )}
      />
      {hint && !error && (
        <p className="text-xs text-[var(--color-foreground-muted)]">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--color-error)]">{error}</p>
      )}
    </div>
  );
}
