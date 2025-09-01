"use client";
import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateToken } from '@/utils/jwt';

function getUser(username: string) {
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  return users[username];
}

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    if (params.get('registered')) setMessage('Registration successful! Please login.');
    if (params.get('loggedout')) setMessage("You've been logged out");
  }, [params]);

  const handleLogin = (username: string, password: string) => {
    const user = getUser(username);
    if (!user || user.password !== password) {
      setError('Invalid username or password');
      return;
    }
    setError(undefined);
    const token = generateToken({ username }, 120); // 2 min expiry
    localStorage.setItem('token', token);
    router.push('/home');
  };

  return (
    <>
      {message && <div className="text-green-600 text-center mt-4">{message}</div>}
      <LoginForm onLogin={handleLogin} error={error} />
      <div className="text-center mt-4">
        <span>Don't have an account? </span>
        <a href="/register" className="text-blue-600 hover:underline">Register</a>
      </div>
    </>
  );
}
