import { useEffect, useRef } from "react";

export function useProximityAudio(fadeRange = 400) {
  const audios = useRef<Map<string, any>>(new Map());
  const rafRef = useRef<number | null>(null);

  const updateVolumes = () => {
    const viewportCenter = window.innerHeight / 2;
    audios.current.forEach((rec) => {
      const rect = rec.panelEl.getBoundingClientRect();
      const triggerY = rect.top + rec.yPos * rect.height;
      const distance = Math.abs(triggerY - viewportCenter);
      const t = Math.max(0, 1 - distance / fadeRange);
      rec.audio.volume = Math.max(0, Math.min(1, t * rec.maxVolume));

      if (rec.audio.volume > 0 && rec.audio.paused) rec.audio.play().catch(() => {});
      else if (rec.audio.volume === 0 && !rec.audio.paused) rec.audio.pause();
    });
    rafRef.current = requestAnimationFrame(updateVolumes);
  };

  useEffect(() => {
    window.addEventListener("scroll", updateVolumes);
    return () => {
      window.removeEventListener("scroll", updateVolumes);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const register = (opts: any) => {
    const a = new Audio(opts.src);
    a.loop = true;
    a.volume = 0;
    audios.current.set(opts.id, { ...opts, audio: a });
  };

  const unregister = (id: string) => {
    const rec = audios.current.get(id);
    if (rec) { rec.audio.pause(); audios.current.delete(id); }
  };

  return { register, unregister };
}