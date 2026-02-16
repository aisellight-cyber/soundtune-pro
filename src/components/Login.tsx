import React, { useState } from 'react';
import './Login.css';
import type { AuthUser } from '../types';

interface LoginProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigate: (mode: 'home' | 'demo' | 'admin' | 'viewer' | 'login') => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getStoredUsers = (): Record<string, any> => {
    const stored = localStorage.getItem('soundtune_users');
    return stored ? JSON.parse(stored) : {};
  };

  const saveUsers = (users: Record<string, any>) => {
    localStorage.setItem('soundtune_users', JSON.stringify(users));
  };

  const getStoredUserSubscriptions = (): Record<string, any> => {
    const stored = localStorage.getItem('soundtune_subscriptions');
    return stored ? JSON.parse(stored) : {};
  };

  const saveSubscriptions = (subs: Record<string, any>) => {
    localStorage.setItem('soundtune_subscriptions', JSON.stringify(subs));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const users = getStoredUsers();

    if (users[username]) {
      setError('Username already exists');
      setLoading(false);
      return;
    }

    // Create new user
    const userId = `user_${Date.now()}`;
    users[username] = {
      id: userId,
      username,
      email,
      passwordHash: btoa(password), // Simple encoding (not secure for production)
      createdAt: new Date().toISOString(),
    };

    saveUsers(users);

    // Initialize subscription (free trial)
    const subscriptions = getStoredUserSubscriptions();
    subscriptions[userId] = {
      status: 'active',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      planType: 'free',
    };
    saveSubscriptions(subscriptions);

    // Auto-login after signup
    const authUser: AuthUser = {
      id: userId,
      username,
      email,
      subscription: subscriptions[userId],
    };

    localStorage.setItem('soundtune_currentUser', JSON.stringify(authUser));
    onLoginSuccess(authUser);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    const users = getStoredUsers();
    const user = users[username];

    if (!user || user.passwordHash !== btoa(password)) {
      setError('Invalid username or password');
      setLoading(false);
      return;
    }

    // Get subscription info
    const subscriptions = getStoredUserSubscriptions();
    const subscription = subscriptions[user.id] || {
      status: 'expired',
      expiresAt: new Date().toISOString(),
      planType: 'free',
    };

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      subscription,
    };

    localStorage.setItem('soundtune_currentUser', JSON.stringify(authUser));
    onLoginSuccess(authUser);
    setLoading(false);
  };

  return (
    <div className="login-page">
      <button className="back-to-home" onClick={() => onNavigate('home')}>
        ← Back to Home
      </button>

      <div className="login-container">
        <div className="login-card">
          <h1>📚 SoundTune</h1>
          <p className="tagline">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {isSignup && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? 'Loading...'
                : isSignup
                  ? 'Sign Up'
                  : 'Login'}
            </button>
          </form>

          <p className="toggle-text">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              disabled={loading}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>

          {!isSignup && (
            <div className="demo-login">
              <p>📖 Demo Account (no password required):</p>
              <button
                type="button"
                className="demo-btn"
                onClick={() => {
                  const demoUser: AuthUser = {
                    id: 'demo_user',
                    username: 'demo_reader',
                    email: 'demo@soundtune.com',
                    subscription: {
                      status: 'active',
                      expiresAt: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                      ).toISOString(),
                      planType: 'premium',
                    },
                  };
                  localStorage.setItem(
                    'soundtune_currentUser',
                    JSON.stringify(demoUser)
                  );
                  onLoginSuccess(demoUser);
                }}
              >
                Login as Demo Reader
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
