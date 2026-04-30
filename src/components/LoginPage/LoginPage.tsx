import { useState, type FormEvent } from 'react';
import { apiLogin } from '../../services/apiService';
import type { User } from '../../models/types';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) {
      setError('Please enter your username.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await apiLogin(trimmed, password);
      onLogin(user);
    } catch {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-overlay">
      <div className="login-card">
        <h1 className="login-card__title">Time Card Tracker</h1>
        <p className="login-card__subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <label className="login-card__label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className={`login-card__input${error ? ' login-card__input--error' : ''}`}
            placeholder="Username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            autoFocus
            autoComplete="username"
            spellCheck={false}
          />

          <label className="login-card__label" htmlFor="password" style={{ marginTop: '16px' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`login-card__input${error ? ' login-card__input--error' : ''}`}
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(''); }}
            autoComplete="current-password"
          />

          {error && <p className="login-card__error">{error}</p>}

          <button
            type="submit"
            className="login-card__btn"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
