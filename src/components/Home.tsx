import React from 'react';
import './Home.css';

interface HomeProps {
  onNavigate: (mode: 'demo' | 'admin' | 'viewer' | 'login') => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1>🎬 SoundTune</h1>
          <p className="tagline">Interactive Vertical Manhwa Storytelling Platform</p>
          <p className="subtitle">
            Create, share, and experience immersive visual stories with integrated audio
          </p>
        </div>

        <div className="modes-grid">
          {/* Demo Mode */}
          <div
            className="mode-card demo-card"
            onClick={() => onNavigate('demo')}
          >
            <div className="mode-icon">📖</div>
            <h2>Example Story</h2>
            <p>Explore our beautiful demo project featuring multiple panels and audio integration</p>
            <button className="mode-button">View Demo →</button>
          </div>

          {/* Viewer Mode */}
          <div
            className="mode-card viewer-card"
            onClick={() => onNavigate('viewer')}
          >
            <div className="mode-icon">👁️</div>
            <h2>Reader Mode</h2>
            <p>Experience stories the way they're meant to be seen. Audio plays automatically without visible controls</p>
            <ul className="features">
              <li>✓ Beautiful full-screen reading</li>
              <li>✓ Auto-play audio narration</li>
              <li>✓ No visible audio player</li>
              <li>✓ Keyboard & touch support</li>
            </ul>
            <button className="mode-button">Read Stories →</button>
          </div>
        </div>

        <div className="info-section">
          <h2>Experience Premium Stories</h2>
          <div className="workflow">
            <div className="workflow-step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up or login to access reader mode</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">2</div>
              <h3>Browse Stories</h3>
              <p>Explore free and premium manhwa content</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-number">3</div>
              <h3>Enjoy</h3>
              <p>Read immersive stories with auto-playing audio</p>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Why SoundTune?</h2>
          <div className="features-list">
            <div className="feature-item">
              <span>🎨</span>
              <h3>Beautiful Design</h3>
              <p>Clean, modern interface optimized for visual storytelling</p>
            </div>
            <div className="feature-item">
              <span>🔊</span>
              <h3>Audio Integration</h3>
              <p>Seamless audio that plays automatically without UI clutter</p>
            </div>
            <div className="feature-item">
              <span>📱</span>
              <h3>Responsive</h3>
              <p>Perfect on desktop, tablet, and mobile devices</p>
            </div>
            <div className="feature-item">
              <span>⚡</span>
              <h3>Fast & Lightweight</h3>
              <p>No external dependencies, completely client-side</p>
            </div>
            <div className="feature-item">
              <span>🎮</span>
              <h3>Easy Navigation</h3>
              <p>Keyboard, touch, and mouse support for any reading style</p>
            </div>
            <div className="feature-item">
              <span>💾</span>
              <h3>Auto-Save</h3>
              <p>Your stories are automatically saved to browser storage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
