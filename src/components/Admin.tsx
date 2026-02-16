import React, { useState, useEffect } from 'react';
import './Admin.css';

interface AdminProps {
  onNavigate: (mode: 'home' | 'demo' | 'admin' | 'viewer' | 'login') => void;
}

interface StoredStory {
  id: string;
  title: string;
  description?: string;
  panels: StoredPanel[];
  createdAt: string;
  creatorId: string;
  isPaid: boolean;
  price?: number;
}

interface StoredPanel {
  id: string;
  title?: string;
  description?: string;
  imageBase64: string; // Base64 encoded PNG
  audioBase64?: string; // Base64 encoded audio
  audioFileName?: string;
  imageFileName: string;
}

const Admin: React.FC<AdminProps> = ({ onNavigate }) => {
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [storyIsPaid, setStoryIsPaid] = useState(false);
  const [storyPrice, setStoryPrice] = useState(4.99);
  const [panelTitle, setPanelTitle] = useState('');
  const [panelDescription, setPanelDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isCreatorAuthenticated, setIsCreatorAuthenticated] = useState(false);

  // Check creator auth on mount
  useEffect(() => {
    const creatorAuth = localStorage.getItem('soundtune_creator_auth');
    if (creatorAuth === 'true') {
      setIsCreatorAuthenticated(true);
    }
  }, []);

  // Load stories from localStorage on mount
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

  // Save stories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('soundtune_stories', JSON.stringify(stories));
  }, [stories]);

  const handleLogout = () => {
    localStorage.removeItem('soundtune_creator_auth');
    setIsCreatorAuthenticated(false);
    onNavigate('home');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (PNG, JPG, etc.)');
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedAudio(file);
    } else {
      alert('Please select a valid audio file (MP3, WAV, OGG, etc.)');
    }
  };

  const createNewStory = () => {
    if (!storyTitle.trim()) {
      alert('Please enter a story title');
      return;
    }
    const newStory: StoredStory = {
      id: `story-${Date.now()}`,
      title: storyTitle,
      description: storyDescription,
      panels: [],
      createdAt: new Date().toISOString(),
      creatorId: 'admin', // In production, use actual creator ID from auth
      isPaid: storyIsPaid,
      price: storyIsPaid ? storyPrice : undefined,
    };
    setStories([...stories, newStory]);
    setCurrentStoryId(newStory.id);
    setStoryTitle('');
    setStoryDescription('');
    setStoryIsPaid(false);
    setStoryPrice(4.99);
  };

  const addPanel = () => {
    if (!currentStoryId) {
      alert('Please create or select a story first');
      return;
    }
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageBase64 = event.target?.result as string;

      let audioBase64: string | undefined;
      let audioFileName: string | undefined;

      if (selectedAudio) {
        const audioReader = new FileReader();
        audioReader.onload = (audioEvent) => {
          audioBase64 = audioEvent.target?.result as string;
          audioFileName = selectedAudio.name;
          finishAddingPanel(imageBase64, audioBase64, audioFileName);
        };
        audioReader.readAsDataURL(selectedAudio);
      } else {
        finishAddingPanel(imageBase64, undefined, undefined);
      }
    };
    reader.readAsDataURL(selectedImage);
  };

  const finishAddingPanel = (
    imageBase64: string,
    audioBase64?: string,
    audioFileName?: string
  ) => {
    const newPanel: StoredPanel = {
      id: `panel-${Date.now()}`,
      title: panelTitle || undefined,
      description: panelDescription || undefined,
      imageBase64,
      imageFileName: selectedImage!.name,
      audioBase64,
      audioFileName,
    };

    setStories(
      stories.map((story) => {
        if (story.id === currentStoryId) {
          return { ...story, panels: [...story.panels, newPanel] };
        }
        return story;
      })
    );

    // Reset form
    setSelectedImage(null);
    setSelectedAudio(null);
    setImagePreview('');
    setPanelTitle('');
    setPanelDescription('');
  };

  const deleteStory = (storyId: string) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setStories(stories.filter((s) => s.id !== storyId));
      if (currentStoryId === storyId) {
        setCurrentStoryId(null);
      }
    }
  };

  const deletePanel = (panelId: string) => {
    if (!currentStoryId) return;
    setStories(
      stories.map((story) => {
        if (story.id === currentStoryId) {
          return {
            ...story,
            panels: story.panels.filter((p) => p.id !== panelId),
          };
        }
        return story;
      })
    );
  };

  const currentStory = stories.find((s) => s.id === currentStoryId);

  if (!isCreatorAuthenticated) {
    return (
      <div className="admin-auth">
        <div className="auth-container">
          <h1>🔐 Admin Access</h1>
          <p>Creator access only</p>
          <button
            className="access-btn"
            onClick={() => onNavigate('home')}
          >
            ← Back to Home
          </button>
          <p className="hint">Access denied: Creator authentication required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <button className="back-to-home" onClick={() => onNavigate('home')}>
        ← Back to Home
      </button>
      <div className="admin-header">
        <h1>📝 Manhwa Admin Panel</h1>
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="admin-content">
        {/* Stories Sidebar */}
        <div className="stories-sidebar">
          <h2>Stories</h2>

          <div className="create-story">
            <input
              type="text"
              placeholder="Story title..."
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
            />
            <textarea
              placeholder="Story description..."
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
            />
            <div className="pricing-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={storyIsPaid}
                  onChange={(e) => setStoryIsPaid(e.target.checked)}
                />
                Make this story PAID
              </label>
              {storyIsPaid && (
                <div className="price-input">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    min="0.99"
                    max="99.99"
                    step="0.01"
                    value={storyPrice}
                    onChange={(e) => setStoryPrice(parseFloat(e.target.value))}
                  />
                </div>
              )}
            </div>
            <button onClick={createNewStory} className="create-btn">
              + New Story
            </button>
          </div>

          <div className="stories-list">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`story-item ${
                  currentStoryId === story.id ? 'active' : ''
                }`}
              >
                <div
                  className="story-info"
                  onClick={() => setCurrentStoryId(story.id)}
                >
                  <h3>{story.title}</h3>
                  <p>{story.panels.length} panels</p>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteStory(story.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        <div className="editor-panel">
          {!currentStory ? (
            <div className="no-selection">
              <p>Select or create a story to start editing</p>
            </div>
          ) : (
            <>
              <h2>{currentStory.title}</h2>

              {/* Add Panel Form */}
              <div className="add-panel-form">
                <h3>Add Panel</h3>

                <div className="form-group">
                  <label>Panel Title (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Chapter 1 - Opening"
                    value={panelTitle}
                    onChange={(e) => setPanelTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Panel Description (Optional)</label>
                  <textarea
                    placeholder="Scene description..."
                    value={panelDescription}
                    onChange={(e) => setPanelDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>PNG Image (Tall format recommended 9:16)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Audio (Optional)</label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                  />
                  {selectedAudio && (
                    <p className="audio-selected">✓ {selectedAudio.name}</p>
                  )}
                </div>

                <div className="form-actions">
                  <button onClick={addPanel} className="add-panel-btn primary">
                    ✨ Add Panel to Story
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedAudio(null);
                      setImagePreview('');
                      setPanelTitle('');
                      setPanelDescription('');
                    }} 
                    className="clear-btn"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {/* Panels List */}
              <div className="panels-list">
                <h3>Story Panels ({currentStory.panels.length})</h3>
                <div className="panels-grid">
                  {currentStory.panels.map((panel, index) => (
                    <div key={panel.id} className="panel-thumbnail">
                      <div className="thumbnail-number">{index + 1}</div>
                      <img src={panel.imageBase64} alt={`Panel ${index + 1}`} />
                      <div className="panel-info">
                        {panel.title && <h4>{panel.title}</h4>}
                        {panel.audioBase64 && <span className="audio-badge">🔊 Audio</span>}
                      </div>
                      <button
                        className="delete-panel-btn"
                        onClick={() => deletePanel(panel.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
