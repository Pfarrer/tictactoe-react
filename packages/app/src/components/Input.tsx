import { useId } from "react";

type InputProps = {
  value: string;
  label?: string;

  onChange: (value: string) => void;
};

export function Input({ value, onChange, label }: InputProps) {
  const inputId = useId();

  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-inactive">
          {label}
        </label>
      )}
      <input
        type="text"
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm rounded-md border border-inactive focus:ring-active focus:border-active block w-full p-2"
      />
    </div>
  );
}
