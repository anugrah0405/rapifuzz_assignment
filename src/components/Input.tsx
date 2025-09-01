import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <label className="block mb-2">
    <span className="block text-sm font-medium mb-1">{label}</span>
    <input
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring"
      {...props}
    />
  </label>
);

export default Input;
