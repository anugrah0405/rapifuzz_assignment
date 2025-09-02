"use client";
import React, { useState } from 'react';
import RegisterForm from '@/components/RegisterForm';
import { useRouter } from 'next/navigation';

// For demo: store users in localStorage
function saveUser(username: string, password: string) {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  if (users[username]) return false;
  users[username] = { password };
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

export default function RegisterPage() {
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();

  const handleRegister = (username: string, password: string) => {
    if (!saveUser(username, password)) {
      setError('User already exists');
      return;
    }
    setError(undefined);
    router.push('/login?registered=1');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <RegisterForm onRegister={handleRegister} error={error} />
      <div className="text-center mt-6">
        <span className="text-gray-700">Already have an account? </span>
        <a href="/login" className="text-blue-600 hover:underline font-semibold">Login</a>
      </div>
    </div>
  );
}
