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
    <>
      <RegisterForm onRegister={handleRegister} error={error} />
      <div className="text-center mt-4">
        <span>Already have an account? </span>
        <a href="/login" className="text-blue-600 hover:underline">Login</a>
      </div>
    </>
  );
}
