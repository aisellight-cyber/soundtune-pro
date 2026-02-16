import React from 'react';
import type { PanelContent, AudioConfig } from '../types';
import './Panel.css';

interface PanelProps {
  content: PanelContent;
  isInView?: boolean;
  onAudioPlay?: (panelId: string) => void;
  onAudioPause?: (panelId: string) => void;
}

const Panel: React.FC<PanelProps> = ({
  content,
  isInView = false,
  onAudioPlay,
  onAudioPause,
}) => {
  return (
    <div
      className={`panel ${isInView ? 'in-view' : ''} ${
        content.customClassName || ''
      }`}
      id={`panel-${content.id}`}
      style={{
        backgroundColor: content.backgroundColor || '#ffffff',
        minHeight: content.minHeight || '100vh',
      }}
    >
      <div className="panel-content">
        {content.title && <h1 className="panel-title">{content.title}</h1>}

        <div className="panel-visual">{content.visualContent}</div>

        {content.description && (
          <p className="panel-description">{content.description}</p>
        )}

        {content.audio && (
          <AudioComponent
            config={content.audio}
            panelId={content.id}
            onPlay={onAudioPlay}
            onPause={onAudioPause}
          />
        )}
      </div>
    </div>
  );
};

interface AudioComponentProps {
  config: AudioConfig;
  panelId: string;
  onPlay?: (panelId: string) => void;
  onPause?: (panelId: string) => void;
}

const AudioComponent: React.FC<AudioComponentProps> = ({
  config,
  panelId,
  onPlay,
  onPause,
}) => {
  const handlePlay = () => {
    onPlay?.(panelId);
  };

  const handlePause = () => {
    onPause?.(panelId);
  };

  return (
    <div className="panel-audio">
      <audio
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        preload="metadata"
        aria-label={config.label || 'Panel audio'}
      >
        <source src={config.src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Panel;
