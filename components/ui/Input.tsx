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
}: InputProps) {
  const inputId = id || name;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-foreground)]"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
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
        className={`w-full px-4 py-3 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
