import { useCallback, useRef } from 'react';

interface AudioState {
  currentlyPlaying: string | null;
  duration: number;
  currentTime: number;
}

export const useAudioManager = () => {
  const audioRefsMap = useRef<Map<string, HTMLAudioElement>>(new Map());
  const currentlyPlayingRef = useRef<string | null>(null);

  const registerAudio = useCallback(
    (panelId: string, audioElement: HTMLAudioElement) => {
      audioRefsMap.current.set(panelId, audioElement);
    },
    []
  );

  const unregisterAudio = useCallback((panelId: string) => {
    audioRefsMap.current.delete(panelId);
  }, []);

  const playAudio = useCallback((panelId: string) => {
    const audio = audioRefsMap.current.get(panelId);
    if (audio) {
      audio.play();
      currentlyPlayingRef.current = panelId;
    }
  }, []);

  const pauseAudio = useCallback((panelId: string) => {
    const audio = audioRefsMap.current.get(panelId);
    if (audio) {
      audio.pause();
      if (currentlyPlayingRef.current === panelId) {
        currentlyPlayingRef.current = null;
      }
    }
  }, []);

  const pauseAllExcept = useCallback((panelId: string) => {
    audioRefsMap.current.forEach((audio, id) => {
      if (id !== panelId && !audio.paused) {
        audio.pause();
      }
    });
    currentlyPlayingRef.current = panelId;
  }, []);

  const getAudioState = useCallback(
    (panelId: string): AudioState => {
      const audio = audioRefsMap.current.get(panelId);
      return {
        currentlyPlaying: currentlyPlayingRef.current,
        duration: audio?.duration || 0,
        currentTime: audio?.currentTime || 0,
      };
    },
    []
  );

  return {
    registerAudio,
    unregisterAudio,
    playAudio,
    pauseAudio,
    pauseAllExcept,
    getAudioState,
  };
};

export const useIntersectionObserver = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useIntersectionObserver(ref);

  return { ref, isVisible };
};

function useIntersectionObserver(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return [isVisible, setIsVisible] as const;
}
