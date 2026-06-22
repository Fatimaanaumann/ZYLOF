import React, { useState } from 'react';
import { useAudio } from './AudioCore';

// Define the structural layout of a song within the queue system
interface QueueTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export const QueueManager: React.FC = () => {
  const { currentTrack } = useAudio();
  
  // Hardcoded initial tracks to simulate your custom playlist stack
  const [queue, setQueue] = useState<QueueTrack[]>([
    { id: '1', title: 'Drivers License', artist: 'Olivia Rodrigo', duration: '4:02' },
    { id: '2', title: 'Bad Guy', artist: 'Billie Eilish', duration: '3:14' },
    { id: '3', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: '2:58' },
    { id: '4', title: 'Ocean Eyes', artist: 'Billie Eilish', duration: '3:20' },
  ]);

  // Move a song higher up in the queue execution stack
  const moveUp = (index: number) => {
    if (index === 0) return; // Already at the top
    const updatedQueue = [...queue];
    const temp = updatedQueue[index];
    updatedQueue[index] = updatedQueue[index - 1];
    updatedQueue[index - 1] = temp;
    setQueue(updatedQueue);
  };

  // Move a song lower down in the queue execution stack
  const moveDown = (index: number) => {
    if (index === queue.length - 1) return; // Already at the bottom
    const updatedQueue = [...queue];
    const temp = updatedQueue[index];
    updatedQueue[index] = updatedQueue[index + 1];
    updatedQueue[index + 1] = temp;
    setQueue(updatedQueue);
  };

  // Remove a song completely from the custom playback order
  const removeFromQueue = (id: string) => {
    setQueue(queue.filter(track => track.id !== id));
  };

  return (
    <div className="zylo-panel-glass" style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', color: 'var(--text-main)' }}>Custom Playback Queue</h2>
      
      {/* Active Track View Component Block */}
      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '20px' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>Now Playing</span>
        <p style={{ fontWeight: 'bold', marginTop: '4px' }}>{currentTrack ? currentTrack.title : 'No Track Selected'}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentTrack ? currentTrack.artist : 'Select a track to begin'}</p>
      </div>

      {/* Stacked Queue List Layout Component */}
      <h3 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-muted)' }}>Next Up</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {queue.map((track, index) => (
          <div key={track.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '8px', background: 'rgba(0,0,0,0.15)', borderRadius: '6px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{track.title}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{track.artist}</p>
            </div>
            
            {/* Interactive Custom Ordering Buttons */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => moveUp(index)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }} title="Move Up">▲</button>
              <button onClick={() => moveDown(index)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }} title="Move Down">▼</button>
              <button onClick={() => removeFromQueue(track.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', marginLeft: '8px' }} title="Remove">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
