import type { Children } from "#utils.ts";
import { useId } from "react";

type SelectProps = {
  value: string;
  label?: string;

  onChange: (value: string) => void;
} & Children;

export function Select({ label, value, onChange, children }: SelectProps) {
  const inputId = useId();

  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={inputId} className="block mt-2 mb-1 font-medium text-inactive">
          {label}
        </label>
      )}
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full p-2.5 rounded-md border border-inactive focus:ring-active focus:border-active"
      >
        {children}
      </select>
    </div>
  );
}

type SelectOptionProps = {
  value: string;
  text: string;
};

export function SelectOption({ value, text }: SelectOptionProps) {
  return <option value={value}>{text}</option>;
}
