import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <label className="block mb-4">
    <span className="block text-sm font-semibold mb-1 text-gray-700">{label}</span>
    <input
      className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-150 bg-gray-50"
      {...props}
    />
  </label>
);

export default Input;
