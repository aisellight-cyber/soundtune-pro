import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { StoryConfig, PanelPosition } from '../types';
import Panel from './Panel';
import './Story.css';

interface StoryProps {
  config: StoryConfig;
  onPanelInView?: (panelId: string, progress: number) => void;
}

const Story: React.FC<StoryProps> = ({ config, onPanelInView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelPositions, setPanelPositions] = useState<PanelPosition[]>([]);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<
    string | null
  >(null);
  const audioRefsMap = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Calculate panel positions and visibility
  const updatePanelPositions = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const viewportHeight = window.innerHeight;
    const scrollTop = container.scrollTop || window.scrollY;

    const positions = config.panels.map((panel) => {
      const element = document.getElementById(`panel-${panel.id}`);
      if (!element) return null;

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementHeight = rect.height;

      const isInView = rect.bottom > 0 && rect.top < viewportHeight;

      // Calculate progress (0 = top of viewport, 1 = fully in view)
      const distanceFromViewportTop = rect.top;
      const progress = Math.max(
        0,
        Math.min(
          1,
          1 - Math.abs(distanceFromViewportTop - viewportHeight / 2) / (viewportHeight / 2)
        )
      );

      return {
        id: panel.id,
        top: elementTop,
        height: elementHeight,
        isInView,
        progress,
      };
    });

    const validPositions = positions.filter(
      (p): p is PanelPosition => p !== null
    );
    setPanelPositions(validPositions);

    // Trigger callback for panels that are in view
    validPositions.forEach((pos) => {
      if (pos.isInView && onPanelInView) {
        onPanelInView(pos.id, pos.progress);
      }
    });
  }, [config.panels, onPanelInView]);

  // Listen to scroll events
  useEffect(() => {
    const element = containerRef.current || window;
    element.addEventListener('scroll', updatePanelPositions, { passive: true });
    element.addEventListener('resize', updatePanelPositions, { passive: true });

    // Initial calculation
    updatePanelPositions();

    return () => {
      element.removeEventListener('scroll', updatePanelPositions);
      element.removeEventListener('resize', updatePanelPositions);
    };
  }, [updatePanelPositions]);

  // Handle audio playback management
  const handleAudioPlay = useCallback(
    (panelId: string) => {
      // Pause other audio if configured
      if (config.pauseOtherAudio && currentlyPlayingAudio) {
        const otherAudio = audioRefsMap.current.get(currentlyPlayingAudio);
        if (otherAudio) {
          otherAudio.pause();
        }
      }
      setCurrentlyPlayingAudio(panelId);
    },
    [config.pauseOtherAudio, currentlyPlayingAudio]
  );

  const handleAudioPause = useCallback(() => {
    setCurrentlyPlayingAudio(null);
  }, []);

  // Store audio refs for management
  const storeAudioRef = useCallback((panelId: string, ref: HTMLAudioElement | null) => {
    if (ref) {
      audioRefsMap.current.set(panelId, ref);
    }
  }, []);

  const isInView = (panelId: string): boolean => {
    return panelPositions.some((p) => p.id === panelId && p.isInView);
  };

  return (
    <div className="story-container" ref={containerRef}>
      <div className="story-header">
        <h1 className="story-title">{config.title}</h1>
        {config.description && (
          <p className="story-description">{config.description}</p>
        )}
      </div>

      <div className="story-panels">
        {config.panels.map((panel) => (
          <div key={panel.id} className="panel-wrapper">
            <Panel
              content={panel}
              isInView={isInView(panel.id)}
              onAudioPlay={handleAudioPlay}
              onAudioPause={handleAudioPause}
            />
          </div>
        ))}
      </div>

      <div className="story-footer">
        <p>End of Story</p>
      </div>

      {/* Hidden audio refs holder for management */}
      {config.panels.map((panel) => (
        panel.audio && (
          <audio
            key={`audio-ref-${panel.id}`}
            ref={(ref) => {
              if (ref) storeAudioRef(panel.id, ref);
            }}
            src={panel.audio.src}
            style={{ display: 'none' }}
          />
        )
      ))}
    </div>
  );
};

export default Story;
