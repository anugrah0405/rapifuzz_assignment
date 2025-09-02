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
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Validation function
  const validate = () => {
    let valid = true;
    // Username validation
    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    } else if (username.length < 3) {
      setUsernameError('Must be at least 3 characters');
      valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Only contain letters, numbers, and underscores');
      valid = false;
    } else {
      setUsernameError(undefined);
    }
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError(undefined);
    }
    return valid;
  };

  // Live validation on input change, but only after touched
  React.useEffect(() => {
    if (usernameTouched) {
      if (!username.trim()) setUsernameError('Username is required');
      else if (username.length < 3) setUsernameError('Must be at least 3 characters');
      else if (!/^[a-zA-Z0-9_]+$/.test(username)) setUsernameError('Only contain letters, numbers, and underscores');
      else setUsernameError(undefined);
    }
  }, [username, usernameTouched]);
  React.useEffect(() => {
    if (passwordTouched) {
      if (!password) setPasswordError('Password is required');
      else if (password.length < 6) setPasswordError('Must be at least 6 characters');
      else setPasswordError(undefined);
    }
  }, [password, passwordTouched]);

  return (
    <form
      className="w-sm mx-auto mt-8 p-8 bg-white rounded-2xl shadow-lg border border-gray-100"
      onSubmit={e => {
        e.preventDefault();
        if (!validate()) return;
        onLogin(username, password);
      }}
    >
      <h2 className="text-2xl font-medium mb-6 text-center text-blue-600">Login</h2>
      <Input
        label="Username"
        value={username}
        onChange={e => {
          setUsername(e.target.value);
        }}
        onBlur={() => setUsernameTouched(true)}
        required
      />
      {usernameTouched && usernameError && <div className="text-red-600 mb-2 text-xs font-medium text-left">{usernameError}</div>}
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
        }}
        onBlur={() => setPasswordTouched(true)}
        required
      />
      {passwordTouched && passwordError && <div className="text-red-600 mb-2 text-xs font-medium text-left">{passwordError}</div>}
      {error && (
        <div className="text-red-600 mb-4 text-center font-medium">
          {error}
        </div>
      )}
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
