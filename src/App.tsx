import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from 'lucide-react';
import { supabase } from './supabaseClient';

export default function App() {
  const [chapterTitle, setChapterTitle] = useState<any>("");
  const [chapterImage, setChapterImage] = useState<any>(null);
  const [panels, setPanels] = useState<any[]>([]);
  const [editingTrigger, setEditingTrigger] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'studio' | 'reader'>('studio');
  const [loading, setLoading] = useState(false);
  
  const audioManager = useRef<Map<string, HTMLAudioElement>>(new Map());
  const activeFades = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unlock = () => {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (context.state === 'suspended') context.resume();
      const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==");
      silent.play().catch(() => {});
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, []);

  const handleChapterImageUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setChapterImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const addPanels = (e: any) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPanels = newFiles.map((file: any) => ({
        id: `p-${Math.random()}-${Date.now()}`,
        imageUrl: URL.createObjectURL(file),
        triggers: []
      }));
      setPanels((prev: any) => [...prev, ...newPanels]);
    }
  };

  const handlePublish = async () => {
    if (!chapterTitle || panels.length === 0) return;
    setLoading(true);
    try {
      await supabase.from('episodes').insert([{ title: chapterTitle, content: panels, thumbnail: chapterImage }]);
      setViewMode('reader');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopAudioWithFade = useCallback((triggerId: string, fadeOutDuration: number) => {
    const audio = audioManager.current.get(triggerId);
    if (audio && !activeFades.current.has(triggerId)) {
      activeFades.current.add(triggerId);
      const step = 0.05;
      const interval = setInterval(() => {
        if (audio.volume > step) {
          audio.volume -= step;
        } else {
          audio.volume = 0;
          audio.pause();
          audioManager.current.delete(triggerId);
          activeFades.current.delete(triggerId);
          clearInterval(interval);
        }
      }, (fadeOutDuration * 1000) / (audio.volume / step || 1));
    }
  }, []);

  const playAudio = useCallback((trigger: any) => {
    if (!trigger.audioUrl || audioManager.current.has(trigger.id)) return;
    const audio = new Audio(trigger.audioUrl);
    audio.loop = true;
    audio.volume = 0;
    audioManager.current.set(trigger.id, audio);
    audio.play().then(() => {
      const step = 0.05;
      const interval = setInterval(() => {
        if (audio.volume < trigger.volume - step) {
          audio.volume += step;
        } else {
          audio.volume = trigger.volume;
          clearInterval(interval);
        }
      }, (trigger.fadeIn * 1000) / (trigger.volume / step || 1));
    }).catch(() => {});
  }, []);

  const saveTriggerSettings = () => {
    if (!editingTrigger) return;
    setPanels(prev => prev.map(p => {
      if (p.id === editingTrigger.panelId) {
        return { ...p, triggers: p.triggers.map((t: any) => t.id === editingTrigger.trigger.id ? { ...editingTrigger.trigger } : t) };
      }
      return p;
    }));
    setEditingTrigger(null);
  };

  const addSoundTrigger = (panelId: any, e: any) => {
    if (viewMode !== 'studio' || e.target.tagName !== 'IMG') return;
    const rect = e.target.getBoundingClientRect();
    const newTrigger = {
      id: `trig-${Date.now()}`,
      xPos: ((e.clientX - rect.left) / rect.width) * 100,
      yPos: ((e.clientY - rect.top) / rect.height) * 100,
      audioUrl: null, volume: 0.5, fadeIn: 1, fadeOut: 1,
      startPanelId: panelId, endPanelId: panelId
    };
    setPanels(prev => prev.map(p => p.id === panelId ? { ...p, triggers: [...p.triggers, newTrigger] } : p));
    setEditingTrigger({ panelId, trigger: { ...newTrigger } });
  };

  const PanelWithAudio = ({ panel, allPanels }: { panel: any; allPanels: any[] }) => {
    const panelRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            allPanels.forEach(p => p.triggers.forEach((t: any) => {
              const sIdx = allPanels.findIndex(pl => pl.id === t.startPanelId);
              const eIdx = allPanels.findIndex(pl => pl.id === t.endPanelId);
              const cIdx = allPanels.findIndex(pl => pl.id === panel.id);
              if (cIdx >= sIdx && cIdx <= eIdx) playAudio(t); else stopAudioWithFade(t.id, t.fadeOut);
            }));
          }
        });
      }, { threshold: 0.1 });
      if (panelRef.current) observer.observe(panelRef.current);
      return () => observer.disconnect();
    }, [allPanels, panel.id, playAudio, stopAudioWithFade]);

    return (
      <div ref={panelRef} style={{ width: '100%', position: 'relative', lineHeight: 0 }}>
        <img src={panel.imageUrl} onClick={(e) => addSoundTrigger(panel.id, e)} style={{ width: '100%', cursor: viewMode === 'studio' ? 'crosshair' : 'default', display: 'block' }} alt="manhwa" />
        {viewMode === 'studio' && panel.triggers.map((t: any) => (
          <div key={t.id} onClick={() => setEditingTrigger({ panelId: panel.id, trigger: { ...t } })}
            style={{ position: 'absolute', top: `${t.yPos}%`, left: `${t.xPos}%`, transform: 'translate(-50%, -50%)', background: editingTrigger?.trigger.id === t.id ? '#fff' : '#3b82f6', borderRadius: '50%', padding: '10px', zIndex: 10, border: '2px solid white', cursor: 'pointer' }}>
            <Icons.Music size={16} color={editingTrigger?.trigger.id === t.id ? '#3b82f6' : 'white'} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden' }}>
      {viewMode === 'studio' && (
        <aside style={{ width: '380px', background: '#0a0a0a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', zIndex: 999 }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
              <button onClick={() => setViewMode('reader')} style={{ flex: 1, background: '#222', color: '#fff', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>READER VIEW</button>
              <button onClick={handlePublish} style={{ flex: 1, background: '#3b82f6', color: '#fff', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>{loading ? '...' : 'PUBLISH'}</button>
            </div>
            
            <label style={{ display: 'block', padding: '10px', background: '#111', border: '1px dashed #333', marginBottom: '10px', textAlign: 'center', cursor: 'pointer' }}>
               {chapterImage ? "Change Thumbnail" : "Upload Thumbnail"}
               <input type="file" hidden onChange={handleChapterImageUpload} />
            </label>

            <input type="text" placeholder="Title" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #333', padding: '10px', color: '#fff' }} />
          </div>

          {editingTrigger && (
            <div style={{ padding: '20px', background: '#111', borderBottom: '1px solid #333' }}>
              <p style={{ fontSize: '12px', color: '#3b82f6' }}>EDITING TRIGGER</p>
              <input type="file" accept="audio/*" onChange={(e: any) => e.target.files[0] && setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, audioUrl: URL.createObjectURL(e.target.files[0])}})} style={{ marginTop: '10px', fontSize: '12px' }} />
              <button onClick={saveTriggerSettings} style={{ width: '100%', marginTop: '10px', background: '#3b82f6', color: 'white', padding: '8px', border: 'none', borderRadius: '4px' }}>SAVE SOUND</button>
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            <label style={{ display: 'block', padding: '20px', border: '2px dashed #3b82f6', color: '#3b82f6', textAlign: 'center', cursor: 'pointer' }}>
              + UPLOAD PANELS <input type="file" multiple hidden onChange={addPanels} />
            </label>
            {panels.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', gap: '10px', padding: '10px', background: '#111', marginTop: '5px', borderRadius: '4px' }}>
                <img src={p.imageUrl} style={{ width: '40px', height: '40px', objectFit: 'cover' }} alt="thumb" />
                <span style={{ fontSize: '12px' }}>Panel {i + 1} ({p.triggers.length} sounds)</span>
              </div>
            ))}
          </div>
        </aside>
      )}

      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', background: '#000', position: 'relative' }}>
        {viewMode === 'reader' && (
          <button onClick={() => setViewMode('studio')} style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000, background: '#3b82f6', border: 'none', padding: '12px', borderRadius: '50%', cursor: 'pointer', color: 'white' }}>
            <Icons.Settings size={20} />
          </button>
        )}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {panels.length === 0 && <div style={{ textAlign: 'center', padding: '100px', color: '#333' }}>No content. Use Studio to upload.</div>}
          {panels.map((panel: any) => <PanelWithAudio key={panel.id} panel={panel} allPanels={panels} />)}
        </div>
      </main>
    </div>
  );
}