import React, { useState, useEffect, useRef } from 'react';
import './Viewer.css';
import type { AuthUser } from '../types';

interface ViewerProps {
  onNavigate: (mode: 'home' | 'demo' | 'admin' | 'viewer' | 'login') => void;
  currentUser: AuthUser;
  onLogout: () => void;
}

interface StoredStoryData {
  id: string;
  title: string;
  description?: string;
  panels: StoredPanelData[];
  createdAt: string;
  creatorId: string;
  isPaid: boolean;
  price?: number;
  coverImageBase64?: string;
}

interface StoredPanelData {
  id: string;
  title?: string;
  description?: string;
  imageBase64: string;
  audioBase64?: string;
  audioFileName?: string;
  imageFileName: string;
}

const Viewer: React.FC<ViewerProps> = ({ onNavigate, currentUser, onLogout }) => {
  const [stories, setStories] = useState<StoredStoryData[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load stories from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('soundtune_stories');
    if (stored) {
      try {
        setStories(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load stories', e);
      }
    }
  }, []);

  const selectedStory = stories.find((s) => s.id === selectedStoryId);
  const currentPanel = selectedStory?.panels[currentPanelIndex];

  // Auto-play audio when panel changes
  useEffect(() => {
    if (currentPanel?.audioBase64 && audioRef.current) {
      audioRef.current.src = currentPanel.audioBase64;
      // Use a small delay to ensure the source is loaded
      setTimeout(() => {
        audioRef.current?.play().catch(() => {
          // Audio autoplay might be blocked by browser
          console.log('Audio autoplay was blocked by browser');
        });
      }, 100);
    }
  }, [currentPanel]);

  const goToNextPanel = () => {
    if (selectedStory && currentPanelIndex < selectedStory.panels.length - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1);
    }
  };

  const goToPreviousPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowRight' || e.code === 'Space') {
        e.preventDefault();
        goToNextPanel();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        goToPreviousPanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStory, currentPanelIndex]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      // Swiped left - next panel
      goToNextPanel();
    } else if (diff < -50) {
      // Swiped right - previous panel
      goToPreviousPanel();
    }
  };

  if (stories.length === 0) {
    return (
      <div className="viewer-container empty">
        <button className="back-to-home" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="empty-message">
          <h2>📖 No Stories Yet</h2>
          <p>Visit the Admin section to create your first manhwa story!</p>
        </div>
      </div>
    );
  }

  if (!selectedStory) {
    return (
      <div className="viewer-container story-list">
        <button className="back-to-home" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="stories-header">
          <div className="header-content">
            <h1>📚 Available Manhwa Stories</h1>
            <div className="user-info">
              <span>👤 {currentUser.username}</span>
              {currentUser.subscription.planType === 'premium' && (
                <span className="premium-badge">⭐ Premium</span>
              )}
              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="stories-grid">
          {stories.map((story) => (
            <div
              key={story.id}
              className="story-card"
              onClick={() => {
                setSelectedStoryId(story.id);
                setCurrentPanelIndex(0);
              }}
            >
              {story.panels[0] && (
                <div className="story-cover">
                  <img
                    src={story.panels[0].imageBase64}
                    alt={story.title}
                  />
                </div>
              )}
              <div className="story-card-info">
                <h2>{story.title}</h2>
                <p>{story.panels.length} panels</p>
                <div className="story-pricing">
                  {story.isPaid ? (
                    <>
                      <span className="paid-badge">🔒 Paid</span>
                      <span className="price">${story.price?.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className="free-badge">✓ Free</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="viewer-container reader"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="back-to-home" onClick={() => onNavigate('home')}>
        ← Back to Home
      </button>
      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => {
          setSelectedStoryId(null);
          setCurrentPanelIndex(0);
        }}
      >
        ← Back to Stories
      </button>

      {/* Story Title */}
      <div className="reader-header">
        <h1>{selectedStory.title}</h1>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentPanelIndex + 1) / selectedStory.panels.length) * 100}%`,
            }}
          />
        </div>
        <p className="panel-counter">
          Panel {currentPanelIndex + 1} of {selectedStory.panels.length}
        </p>
      </div>

      {/* Panel Display */}
      <div className="panel-display">
        <div className="panel-container">
          <img
            src={currentPanel?.imageBase64}
            alt={`Panel ${currentPanelIndex + 1}`}
            className="panel-image"
          />

          {/* Panel Info Overlay (optional) */}
          {(currentPanel?.title || currentPanel?.description) && (
            <div className="panel-info-overlay">
              {currentPanel.title && (
                <h2 className="panel-title">{currentPanel.title}</h2>
              )}
              {currentPanel.description && (
                <p className="panel-description">
                  {currentPanel.description}
                </p>
              )}
            </div>
          )}

          {/* Audio indicator */}
          {currentPanel?.audioBase64 && (
            <div className="audio-indicator">
              <div className="audio-icon">🔊</div>
              <div className="audio-wave">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation">
        <button
          className="nav-button prev"
          onClick={goToPreviousPanel}
          disabled={currentPanelIndex === 0}
        >
          ← Previous
        </button>

        <div className="nav-info">
          <p>Use Arrow Keys or Swipe</p>
        </div>

        <button
          className="nav-button next"
          onClick={goToNextPanel}
          disabled={currentPanelIndex === selectedStory.panels.length - 1}
        >
          Next →
        </button>
      </div>

      {/* Hidden audio player - plays automatically without UI */}
      <audio
        ref={audioRef}
        onEnded={() => {
          // Optionally auto-advance to next panel when audio ends
          // Uncomment the line below to enable this behavior
          // goToNextPanel();
        }}
      />
    </div>
  );
};

export default Viewer;
