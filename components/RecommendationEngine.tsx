import React, { useState } from 'react';
import { useAudio } from './AudioCore';

// Layout structure for a song recommendation item
interface RecommendedTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  audioUrl: string;
}

export const RecommendationEngine: React.FC = () => {
  const { playTrack } = useAudio();
  
  // Local state tracking which artists the user is currently following
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);

  // Curated list of dynamic recommendations based on historical trends
  const recommendations: RecommendedTrack[] = [
    { id: 'rec-1', title: 'Deja Vu', artist: 'Olivia Rodrigo', genre: 'Pop', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'rec-2', title: 'Everything I Wanted', artist: 'Billie Eilish', genre: 'Alternative', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'rec-3', title: 'Happier Than Ever', artist: 'Billie Eilish', genre: 'Alternative', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  // Logic to add or remove creators from the user's targeted engine updates
  const toggleFollow = (artistName: string) => {
    if (followedArtists.includes(artistName)) {
      setFollowedArtists(followedArtists.filter(name => name !== artistName));
    } else {
      setFollowedArtists([...followedArtists, artistName]);
    }
  };

  return (
    <div className="zylo-panel-glass" style={{ maxWidth: '500px', margin: '20px auto' }}>
      <h3 style={{ marginBottom: '4px', fontSize: '1.2rem', fontWeight: 'bold' }}>Smart Recommendations</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Curated dynamic suggestions based on your historical trends</p>

      {/* Suggested Tracks List Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {recommendations.map((track) => (
          <div 
            key={track.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '10px', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '8px',
              borderLeft: followedArtists.includes(track.artist) ? '3px solid var(--accent-secondary)' : '3px solid transparent'
            }}
          >
            {/* Click to play recommendation */}
            <div 
              onClick={() => playTrack({ id: track.id, title: track.title, artist: track.artist, audioUrl: track.audioUrl, coverArt: '' })}
              style={{ flex: 1, cursor: 'pointer' }}
            >
              <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{track.title}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{track.artist} • <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>{track.genre}</span></p>
            </div>

            {/* Follow Creator Engine Toggle Button */}
            <button
              onClick={() => toggleFollow(track.artist)}
              style={{
                background: followedArtists.includes(track.artist) ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                color: followedArtists.includes(track.artist) ? 'var(--accent-secondary)' : 'var(--text-main)',
                border: followedArtists.includes(track.artist) ? '1px solid var(--accent-secondary)' : '1px solid rgba(255,255,255,0.1)',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              {followedArtists.includes(track.artist) ? '✓ Following' : '＋ Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
