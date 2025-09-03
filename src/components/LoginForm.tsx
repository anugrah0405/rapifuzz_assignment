import React, { useState, useEffect } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';

interface Props {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

const LoginForm: React.FC<Props> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validation functions
  const validateUsername = (value: string) => {
    if (!value.trim()) return 'Username is required';
    if (value.length < 3) return 'Must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Only contain letters, numbers, and underscores';
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Must be at least 6 characters';
    return undefined;
  };

  const validateForm = () => {
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);
    setUsernameError(usernameErr);
    setPasswordError(passwordErr);
    return !usernameErr && !passwordErr;
  };

  // Live validation (only after touched)
  useEffect(() => {
    if (usernameTouched) setUsernameError(validateUsername(username));
  }, [username, usernameTouched]);

  useEffect(() => {
    if (passwordTouched) setPasswordError(validatePassword(password));
  }, [password, passwordTouched]);

  return (
    <form
      className="w-sm mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
      onSubmit={e => {
        e.preventDefault();
        if (!validateForm()) return;
        onLogin(username, password);
      }}
    >
      <h2 className="text-2xl font-medium mb-6 text-center text-blue-600">Login</h2>

      <Input
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        onBlur={() => setUsernameTouched(true)}
        required
      />
      {usernameTouched && usernameError && (
        <div className="text-red-600 mb-2 text-xs font-medium text-left">{usernameError}</div>
      )}

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        onBlur={() => setPasswordTouched(true)}
        required
      />
      {passwordTouched && passwordError && (
        <div className="text-red-600 mb-2 text-xs font-medium text-left">{passwordError}</div>
      )}

      {error && <div className="text-red-600 mb-4 text-center font-medium">{error}</div>}

      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
