interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  name,
  id,
  className = "",
  icon,
}: InputProps) {
  const inputId = id || name;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-[var(--color-foreground)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-foreground-muted)]">
            {icon}
          </div>
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
          className={`w-full px-4 py-3 ${icon ? "pl-12" : ""} border border-[var(--color-border)] rounded-[var(--radius)] bg-white text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent focus:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-red-500 focus:ring-red-500"
              : ""
          }`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
