import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioCore';

interface CommunityUpdate {
  id: number;
  user: string;
  song: string;
  action: string;
}

export const ListeningParty: React.FC = () => {
  const { currentTrack } = useAudio();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  
  // Simulated background activity feed state
  const [updates, setUpdates] = useState<CommunityUpdate[]>([
    { id: 1, user: 'VibeCheck_99', song: 'Drivers License', action: 'is looping' },
    { id: 2, user: 'NeonIndigo', song: 'Bad Guy', action: 'just added' },
    { id: 3, user: 'CyanWave', song: 'Ocean Eyes', action: 'is listening to' },
  ]);

  // Periodic loop to update simulated friend activity every 7 seconds
  useEffect(() => {
    const mockUsers = ['LofiChill_User', 'AudioPhile', 'MidnightDriver', 'BassDrop'];
    const mockSongs = ['Good 4 U', 'Happier Than Ever', 'Deja Vu', 'Everything I Wanted'];
    const mockActions = ['started playing', 'added to queue', 'is looping', 'liked'];

    const interval = setInterval(() => {
      const randomUpdate: CommunityUpdate = {
        id: Date.now(),
        user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        song: mockSongs[Math.floor(Math.random() * mockSongs.length)],
        action: mockActions[Math.floor(Math.random() * mockActions.length)],
      };

      // Keep the feed clean by only keeping the top 4 most recent updates
      setUpdates((prev) => [randomUpdate, ...prev].slice(0, 4));
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Generates a session code for the Friend Mix room layout
  const generateFriendMixRoom = () => {
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setRoomCode(randomCode);
  };

  return (
    <div className="zylo-panel-glass" style={{ maxWidth: '400px', margin: '20px auto' }}>
      {/* Listening Party Module Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Listening Party</h3>
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-secondary)', borderRadius: '12px', fontWeight: 'bold' }}>Live Feed</span>
      </div>

      {/* Social Feed Activity Window */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '8px' }}>
        {updates.map((item) => (
          <div key={item.id} style={{ fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '8px' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>@{item.user}</span>{' '}
            <span style={{ color: 'var(--text-muted)' }}>{item.action}</span>{' '}
            <span style={{ fontWeight: '500' }}>{item.song}</span>
          </div>
        ))}
      </div>

      {/* Friend Mix Collaboration Controls */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', textAlign: 'center' }}>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '8px' }}>Mix With Your Friends</h4>
        
        {!roomCode ? (
          <button 
            onClick={generateFriendMixRoom} 
            className="zylo-btn-primary" 
            style={{ width: '100%', fontSize: '0.9rem', padding: '10px' }}
          >
            Create Friend Mix Session
          </button>
        ) : (
          <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '10px', borderRadius: '6px', border: '1px dashed var(--accent-primary)' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Share room code to blend history:</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '2px', margin: '4px 0', color: 'var(--text-main)' }}>{roomCode}</p>
          </div>
        )}

        {/* Premium Core Feature Notice */}
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
          ⭐ Premium tier accounts (<span style={{ color: 'var(--accent-secondary)' }}>$5/mo</span>) unlock unlimited active mixing lobbies.
        </p>
      </div>
    </div>
  );
};
