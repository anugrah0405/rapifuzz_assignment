import React, { useState } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface Props {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

const LoginForm: React.FC<Props> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow"
      onSubmit={e => {
        e.preventDefault();
        onLogin(username, password);
      }}
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <Input
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
