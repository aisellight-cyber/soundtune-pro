import React from 'react';
import type { StoryConfig } from '../types';

// Visual content components as examples

const PlaceholderShape: React.FC = () => (
  <div
    style={{
      width: '300px',
      height: '300px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold',
      boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
    }}
  >
    Visual Content
  </div>
);

export const exampleStory: StoryConfig = {
  id: 'story-1',
  title: 'The Journey of Sound',
  description: 'An interactive vertical narrative exploring the essence of audio',
  panels: [
    {
      id: 'panel-1',
      title: 'Chapter One: Silence',
      description:
        'In the beginning, there was silence. A vast, empty void waiting to be filled.',
      visualContent: (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              color: 'rgba(255, 255, 255, 0.3)',
              fontWeight: 'bold',
            }}
          >
            Silence...
          </div>
        </div>
      ),
      backgroundColor: '#0f1419',
      minHeight: '100vh',
      audio: {
        src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d58c6023b9.mp3',
        label: 'Ambient silence',
      },
    },
    {
      id: 'panel-2',
      title: 'Chapter Two: The First Sound',
      description: 'A single note breaks through the void, awakening the world.',
      visualContent: <PlaceholderShape />,
      backgroundColor: '#1a2847',
      minHeight: '100vh',
      audio: {
        src: 'https://cdn.pixabay.com/download/audio/2022/01/24/audio_1ca82e60e8.mp3',
        label: 'Musical note',
      },
    },
    {
      id: 'panel-3',
      title: 'Chapter Three: Harmony',
      description: 'Multiple notes come together, creating a beautiful symphony.',
      visualContent: (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: '80px',
                height: '80px',
                background: `hsl(${i * 90}, 70%, 60%)`,
                borderRadius: '50%',
                boxShadow: `0 0 20px hsl(${i * 90}, 70%, 60%)`,
              }}
            />
          ))}
        </div>
      ),
      backgroundColor: '#2d4059',
      minHeight: '100vh',
      audio: {
        src: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_e8447ceb63.mp3',
        label: 'Harmonic composition',
      },
    },
    {
      id: 'panel-4',
      title: 'Chapter Four: Resonance',
      description: 'The sound resonates, echoing through layers of reality.',
      visualContent: (
        <div
          style={{
            width: '100%',
            height: '400px',
            background: 'radial-gradient(circle, #667eea 0%, transparent 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              border: '3px solid #667eea',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }}
          />
        </div>
      ),
      backgroundColor: '#16213e',
      minHeight: '100vh',
      audio: {
        src: 'https://cdn.pixabay.com/download/audio/2022/02/15/audio_02b6ecb904.mp3',
        label: 'Resonant tones',
      },
    },
    {
      id: 'panel-5',
      title: 'The End and New Beginnings',
      description:
        'Every sound ends, but echoes forward into new stories waiting to be told.',
      visualContent: (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ fontSize: '64px', color: 'white', fontWeight: 'bold' }}>
            ✨
          </div>
          <div style={{ fontSize: '24px', color: 'white', textAlign: 'center' }}>
            Your story awaits
          </div>
        </div>
      ),
      backgroundColor: '#764ba2',
      minHeight: '100vh',
    },
  ],
  theme: {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    transitionSpeed: 600,
  },
  autoPlayAudio: false,
  pauseOtherAudio: true,
};

// Sample template for creating custom stories
export const createCustomStory = (
  title: string,
  panels: any[]
): StoryConfig => {
  return {
    id: `story-${Date.now()}`,
    title,
    panels: panels.map((p, i) => ({
      id: `panel-${i}`,
      ...p,
    })),
    autoPlayAudio: false,
    pauseOtherAudio: true,
  };
};
