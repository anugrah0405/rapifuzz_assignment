"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  useEffect(() => {
    if (params.get('registered')) {
      toast.success('Registration successful! Please login.', { position: 'top-center' });
    }
    if (params.get('loggedout')) {
      toast.info("You've been logged out", { position: 'top-center' });
    }
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
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <ToastContainer />
      <LoginForm onLogin={handleLogin} error={error} />
      <div className="text-center mt-6">
        <span className="text-gray-700">Don't have an account? </span>
        <a href="/register" className="text-blue-600 hover:underline font-semibold">Register</a>
      </div>
    </div>
  );
}
