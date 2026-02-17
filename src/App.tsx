import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [chapterTitle, setChapterTitle] = useState<any>("");
  const [chapterImage, setChapterImage] = useState<any>(null);
  const [panels, setPanels] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'studio' | 'reader'>('studio');
  const [loading, setLoading] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (!error && data && data.length > 0) {
        const allPanels = data.flatMap(episode => episode.content);
        setPanels(allPanels);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleChapterImageUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setChapterImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handlePublish = async () => {
    if (!chapterTitle || panels.length === 0) {
      alert("Please add Title and Panels!");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('episodes')
        .insert([{ title: chapterTitle, content: panels, thumbnail: chapterImage }]);
      if (error) throw error;
      alert("Published!");
      fetchContent();
      setViewMode('reader');
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPanels = (e: any) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPanels = newFiles.map((file: any) => ({
        id: `p-${Math.random()}`,
        imageUrl: URL.createObjectURL(file),
        triggers: []
      }));
      setPanels((prev: any) => [...prev, ...newPanels]);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex' }}>
      
      {viewMode === 'studio' && (
        <aside style={{ width: '350px', background: '#111', borderRight: '1px solid #333', padding: '20px', height: '100vh', position: 'fixed', left: 0, zIndex: 1000, overflowY: 'auto' }}>
          <h2 style={{ color: '#3b82f6', marginBottom: '20px' }}>STUDIO MODE</h2>
          
          <div style={{ marginBottom: '20px', border: '1px dashed #444', padding: '10px', textAlign: 'center' }}>
            {chapterImage ? <img src={chapterImage} style={{ width: '100%', height: '100px', objectFit: 'cover' }} alt="thumb" /> : <p>No Cover</p>}
            <input type="file" accept="image/*" onChange={handleChapterImageUpload} style={{ marginTop: '10px', fontSize: '10px' }} />
          </div>

          <input 
            type="text" 
            placeholder="Chapter Title..." 
            value={chapterTitle} 
            onChange={(e) => setChapterTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', border: '1px solid #444', color: '#fff' }}
          />

          <label style={{ display: 'block', padding: '15px', background: '#3b82f6', textAlign: 'center', cursor: 'pointer', borderRadius: '5px', marginBottom: '10px' }}>
            + ADD PANELS
            <input type="file" multiple hidden onChange={addPanels} />
          </label>

          <button 
            onClick={handlePublish} 
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: '#22c55e', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'PUBLISHING...' : 'PUBLISH NOW'}
          </button>
          
          <button onClick={() => setViewMode('reader')} style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#666', border: 'none', cursor: 'pointer' }}>Switch to Reader</button>
        </aside>
      )}

      <main style={{ flex: 1, marginLeft: viewMode === 'studio' ? '350px' : '0', padding: '20px' }}>
        {viewMode === 'reader' && (
          <button onClick={() => setViewMode('studio')} style={{ position: 'fixed', top: '20px', left: '20px', background: '#3b82f6', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', zIndex: 2000 }}>
            OPEN STUDIO
          </button>
        )}
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {panels.length === 0 && <p style={{ textAlign: 'center', marginTop: '50px', color: '#444' }}>No content yet.</p>}
          {panels.map((panel) => (
            <img key={panel.id} src={panel.imageUrl} style={{ width: '100%', marginBottom: '0px', display: 'block' }} alt="panel" />
          ))}
        </div>
      </main>
    </div>
  );
}