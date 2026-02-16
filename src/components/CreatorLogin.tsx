import React, { useState } from 'react';
import './CreatorLogin.css';

interface CreatorLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const CreatorLogin: React.FC<CreatorLoginProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const CREATOR_PASSWORD = 'creator123'; // Change this to your desired password

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      if (password === CREATOR_PASSWORD) {
        localStorage.setItem('soundtune_creator_auth', 'true');
        onLoginSuccess();
      } else {
        setError('Invalid creator password');
        setPassword('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="creator-login-overlay">
      <div className="creator-login-modal">
        <button className="close-btn" onClick={onCancel}>
          ✕
        </button>

        <div className="creator-login-content">
          <h2>🔐 Creator Access</h2>
          <p>Enter your creator password to access the admin panel</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Creator Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Access Admin Panel'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="hint">
            💡 Default password: <strong>creator123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
