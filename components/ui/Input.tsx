'use client';

import { clsx } from "clsx";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const sizeStyles = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-3.5 text-sm",
  lg: "h-11 px-4 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = "md",
      disabled,
      required,
      className = "",
      id,
      name,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            disabled={disabled}
            required={required}
            className={clsx(
              "w-full rounded-lg border bg-white",
              "text-[var(--color-text-primary)]",
              "placeholder:text-[var(--color-text-tertiary)]",
              "transition-all duration-150 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-gray-50)]",
              sizeStyles[inputSize],
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error
                ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
                : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
              {rightIcon}
            </span>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-[var(--color-text-tertiary)]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--color-error)] flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      disabled,
      required,
      className = "",
      id,
      name,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          disabled={disabled}
          required={required}
          rows={rows}
          className={clsx(
            "w-full px-3.5 py-2.5 rounded-lg border bg-white",
            "text-sm text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-tertiary)]",
            "transition-all duration-150 ease-out resize-none",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[var(--color-gray-50)]",
            error
              ? "border-[var(--color-error)] focus:ring-[var(--color-error)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-xs text-[var(--color-text-tertiary)]">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Search Input - specialized variant
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export function SearchInput({ onClear, value, ...props }: SearchInputProps) {
  return (
    <Input
      leftIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      rightIcon={
        value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="p-0.5 hover:bg-[var(--color-gray-100)] rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : undefined
      }
      value={value}
      {...props}
    />
  );
}
