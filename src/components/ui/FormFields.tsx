"use client";

import { clsx } from "clsx";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  valid?: boolean;
}

export function FormInput({ label, error, valid, className, ...props }: FormInputProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
          {label}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          "w-full px-3.5 py-3 border-[1.5px] rounded-sm font-body text-[0.9rem] text-foreground bg-white transition-all outline-none",
          "focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]",
          error && "border-accent-red",
          valid && "border-accent-green",
          !error && !valid && "border-border",
          className
        )}
      />
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function FormSelect({ label, className, children, ...props }: FormSelectProps) {
  return (
    <div className="mb-5">
      {label && (
        <label className="block text-[0.84rem] font-medium text-foreground-secondary mb-1.5">
          {label}
        </label>
      )}
      <select
        {...props}
        className={clsx(
          "w-full px-3.5 py-3 border-[1.5px] border-border rounded-sm font-body text-[0.9rem] text-foreground bg-white transition-all outline-none appearance-none pr-9",
          "focus:border-primary focus:shadow-[0_0_0_3px_var(--color-primary-light)]",
          "bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2716%27%20height=%2716%27%20fill=%27none%27%20stroke=%27%23888%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3E%3Cpath%20d=%27M4%206l4%204%204-4%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]",
          className
        )}
      >
        {children}
      </select>
    </div>
  );
}
