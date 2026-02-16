import { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from 'lucide-react';

export default function App() {
  const [chapterTitle, setChapterTitle] = useState<any>("");
  const [chapterImage, setChapterImage] = useState<any>(null);
  const [panels, setPanels] = useState<any[]>([]);
  const [editingTrigger, setEditingTrigger] = useState<any>(null);
  
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

  const stopAudioWithFade = useCallback((triggerId: string, fadeOutDuration: number) => {
    const audio = audioManager.current.get(triggerId);
    if (audio && !activeFades.current.has(triggerId)) {
      activeFades.current.add(triggerId);
      
      const step = 0.05;
      const startVol = audio.volume;
      const intervalTime = (fadeOutDuration * 1000) / (startVol / step || 1);
      
      const fadeTimer = setInterval(() => {
        if (audio.volume > step) {
          audio.volume -= step;
        } else {
          audio.volume = 0;
          audio.pause();
          audio.src = "";
          audioManager.current.delete(triggerId);
          activeFades.current.delete(triggerId);
          clearInterval(fadeTimer);
        }
      }, Math.max(intervalTime, 30));
    }
  }, []);

  const playAudio = useCallback((trigger: any) => {
    if (!trigger.audioUrl || audioManager.current.has(trigger.id)) return;
    if (activeFades.current.has(trigger.id)) return; // لا تشغله إذا كان في مرحلة الخفوت حالياً
    
    const audio = new Audio(trigger.audioUrl);
    audio.loop = true;
    
    const targetVol = trigger.volume;
    audio.volume = 0;
    audioManager.current.set(trigger.id, audio);
    
    audio.play().then(() => {
      const step = 0.05;
      const intervalTime = (trigger.fadeIn * 1000) / (targetVol / step || 1);
      const fadeTimer = setInterval(() => {
        if (audio.volume < targetVol - step) {
          audio.volume += step;
        } else {
          audio.volume = targetVol;
          clearInterval(fadeTimer);
        }
      }, Math.max(intervalTime, 30));
    }).catch(() => {});
  }, []);

  const immediateStop = (triggerId: string) => {
    const audio = audioManager.current.get(triggerId);
    if (audio) {
      audio.pause();
      audio.src = "";
      audioManager.current.delete(triggerId);
      activeFades.current.delete(triggerId);
    }
  };

  const updateVolume = useCallback((triggerId: string, newVolume: number) => {
    const audio = audioManager.current.get(triggerId);
    if (audio) audio.volume = newVolume;
  }, []);

  const deleteTrigger = useCallback((panelId: any, triggerId: any) => {
    immediateStop(triggerId);
    setPanels(prev => prev.map(p => p.id === panelId ? { ...p, triggers: p.triggers.filter((t: any) => t.id !== triggerId) } : p));
    setEditingTrigger(null);
  }, []);

  const addSoundTrigger = (panelId: any, e: any) => {
    if (e.target.tagName !== 'IMG') return;
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newTrigger = {
      id: `trig-${Date.now()}`,
      xPos: x, yPos: y,
      audioUrl: null,
      volume: 0.5,
      fadeIn: 1,
      fadeOut: 1,
      startPanelId: panelId,
      endPanelId: panelId
    };

    setPanels(prev => prev.map(p => p.id === panelId ? { ...p, triggers: [...p.triggers, newTrigger] } : p));
    setEditingTrigger({ panelId, trigger: { ...newTrigger } });
  };

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

  const PanelWithAudio = ({ panel, allPanels }: { panel: any; allPanels: any[] }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            allPanels.forEach(p => {
              p.triggers.forEach((t: any) => {
                if (!t.audioUrl) return;
                const startIndex = allPanels.findIndex(pl => pl.id === t.startPanelId);
                const endIndex = allPanels.findIndex(pl => pl.id === t.endPanelId);
                const currentIndex = allPanels.findIndex(pl => pl.id === panel.id);

                if (currentIndex >= startIndex && currentIndex <= endIndex) {
                  playAudio(t);
                } else {
                  stopAudioWithFade(t.id, t.fadeOut);
                }
              });
            });
          }
        });
      }, { threshold: 0.1 });

      if (panelRef.current) observer.observe(panelRef.current);
      return () => observer.disconnect();
    }, [allPanels, panel.id, playAudio, stopAudioWithFade]);

    return (
      <div ref={panelRef} style={{ width: '100%', position: 'relative', lineHeight: 0 }}>
        <img src={panel.imageUrl} onClick={(e) => addSoundTrigger(panel.id, e)} style={{ width: '100%', cursor: 'crosshair', display: 'block' }} alt="panel" />
        {panel.triggers.map((t: any) => (
          <div key={t.id} onClick={() => setEditingTrigger({ panelId: panel.id, trigger: { ...t } })}
            style={{ position: 'absolute', top: `${t.yPos}%`, left: `${t.xPos}%`, transform: 'translate(-50%, -50%)', background: editingTrigger?.trigger.id === t.id ? '#fff' : '#3b82f6', borderRadius: '50%', padding: '10px', cursor: 'pointer', zIndex: 10, border: '2px solid white' }}>
            <Icons.Music size={16} color={editingTrigger?.trigger.id === t.id ? '#3b82f6' : 'white'} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <aside style={{ width: '380px', background: '#0a0a0a', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '15px' }}>
            <Icons.Zap size={20} fill="#3b82f6" /> 
            <span style={{ fontWeight: 900 }}>SOUNDTUNE PRO</span>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            {chapterImage ? (
              <div style={{ position: 'relative', width: '100%', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' }}>
                <img src={chapterImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="thumbnail" />
                <button onClick={() => setChapterImage(null)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}>
                  <Icons.X size={14} color="white" />
                </button>
              </div>
            ) : (
              <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60px', background: '#111', border: '1px dashed #333', borderRadius: '8px', cursor: 'pointer' }}>
                <Icons.Image size={20} color="#333" />
                <span style={{ fontSize: '10px', color: '#555' }}>Thumbnail</span>
                <input type="file" accept="image/*" hidden onChange={handleChapterImageUpload} />
              </label>
            )}
          </div>

          <input type="text" placeholder="Title" value={chapterTitle} onChange={(e:any) => setChapterTitle(e.target.value)} style={{ width: '100%', background: '#111', border: '1px solid #222', padding: '8px', borderRadius: '6px', color: '#fff' }} />
        </div>

        {editingTrigger && (
          <div style={{ background: '#111', borderBottom: '1px solid #333', padding: '15px', overflowY: 'auto' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>AUDIO SETTINGS</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Icons.Play size={16} color="#4ade80" style={{ cursor: 'pointer' }} onClick={() => playAudio(editingTrigger.trigger)} />
                  <Icons.Square size={16} color="#f44" style={{ cursor: 'pointer' }} onClick={() => immediateStop(editingTrigger.trigger.id)} />
                </div>
             </div>
             
             <input type="file" accept="audio/*" onChange={(e: any) => { if(e.target.files[0]) setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, audioUrl: URL.createObjectURL(e.target.files[0])}}); }} style={{ width: '100%', marginBottom: '10px', fontSize: '10px' }} />
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginBottom: '10px' }}>
                <div><label>START PANEL</label>
                    <select value={editingTrigger.trigger.startPanelId} onChange={(e) => setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, startPanelId: e.target.value}})} style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid #222' }}>
                      {panels.map((p, idx) => <option key={p.id} value={p.id}>Panel {idx + 1}</option>)}
                    </select>
                </div>
                <div><label>END PANEL</label>
                    <select value={editingTrigger.trigger.endPanelId} onChange={(e) => setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, endPanelId: e.target.value}})} style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid #222' }}>
                      {panels.map((p, idx) => <option key={p.id} value={p.id}>Panel {idx + 1}</option>)}
                    </select>
                </div>
                <div><label>FADE IN (s)</label><input type="number" step="0.1" value={editingTrigger.trigger.fadeIn} onChange={(e) => setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, fadeIn: parseFloat(e.target.value)}})} style={{ width: '100%', background: '#000', border: '1px solid #222', color: '#fff' }} /></div>
                <div><label>FADE OUT (s)</label><input type="number" step="0.1" value={editingTrigger.trigger.fadeOut} onChange={(e) => setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, fadeOut: parseFloat(e.target.value)}})} style={{ width: '100%', background: '#000', border: '1px solid #222', color: '#fff' }} /></div>
             </div>
             
             <div style={{ fontSize: '11px', marginBottom: '10px' }}>
                <label>VOLUME ({Math.round(editingTrigger.trigger.volume * 100)}%)</label>
                <input type="range" min="0" max="1" step="0.01" value={editingTrigger.trigger.volume} onChange={(e) => { const v = parseFloat(e.target.value); setEditingTrigger({...editingTrigger, trigger: {...editingTrigger.trigger, volume: v}}); updateVolume(editingTrigger.trigger.id, v); }} style={{ width: '100%' }} />
             </div>

             <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={saveTriggerSettings} style={{ flex: 1, background: '#3b82f6', padding: '8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>SAVE</button>
                <button onClick={() => deleteTrigger(editingTrigger.panelId, editingTrigger.trigger.id)} style={{ background: '#300', padding: '8px', borderRadius: '4px' }}><Icons.Trash2 size={14} color="#f44" /></button>
             </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
          {panels.map((p: any, i: number) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', background: '#111', padding: '5px', borderRadius: '5px' }}>
              <span style={{ fontSize: '10px', color: '#444' }}>{i+1}</span>
              <img src={p.imageUrl} style={{ width: '30px', height: '30px', objectFit: 'cover' }} alt="panel-thumb" />
              <div style={{ flex: 1, fontSize: '10px' }}>{p.triggers.length} Sounds</div>
            </div>
          ))}
          <label style={{ display: 'block', padding: '10px', border: '1px dashed #3b82f6', color: '#3b82f6', textAlign: 'center', cursor: 'pointer', marginTop: '10px', fontSize: '12px', borderRadius: '8px' }}>
             + Add Panels <input type="file" multiple hidden onChange={addPanels} />
          </label>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {panels.map((panel: any) => <PanelWithAudio key={panel.id} panel={panel} allPanels={panels} />)}
        </div>
      </main>
    </div>
  );
}