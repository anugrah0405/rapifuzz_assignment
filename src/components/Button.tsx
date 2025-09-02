import React from 'react';
import '../styles/hoverClass.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
<button
    className="button w-full bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200 font-semibold disabled:opacity-50 cursor-pointer"
    {...props}
>
    {children}
</button>
);

export default Button;
