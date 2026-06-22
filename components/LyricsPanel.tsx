import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from './AudioCore';

// Layout structure for timestamped lyrics
interface LyricLine {
  time: number; // Time in seconds when this line should highlight
  text: string;
}

export const LyricsPanel: React.FC = () => {
  const { currentTime, isPlaying } = useAudio();
  const [isRepeatMode, setIsRepeatMode] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hardcoded mock timed lyrics for demonstration
  const sampleLyrics: LyricLine[] = [
    { time: 0, text: "🎵 (Intro Instrumentals) 🎵" },
    { time: 5, text: "I got my drivers license last week" },
    { time: 10, text: "Just like we always talked about" },
    { time: 15, text: "'Cause you were so excited for me" },
    { time: 20, text: "To finally drive up to your house" },
    { time: 26, text: "But today I drove through the suburbs" },
    { time: 31, text: "Crying 'cause you weren't around..." }
  ];

  // Track the playback time to update the active highlighted lyric line
  useEffect(() => {
    const currentLineIndex = sampleLyrics.findIndex(
      (line, index) => 
        currentTime >= line.time && 
        (index === sampleLyrics.length - 1 || currentTime < sampleLyrics[index + 1].time)
    );

    if (currentLineIndex !== -1 && currentLineIndex !== activeIndex) {
      setActiveIndex(currentLineIndex);
      
      // Auto-scroll logic to keep active lyric centered in viewport
      const activeElement = containerRef.current?.children[currentLineIndex] as HTMLElement;
      if (activeElement && containerRef.current) {
        containerRef.current.scrollTo({
          top: activeElement.offsetTop - containerRef.current.clientHeight / 2 + activeElement.clientHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentTime, activeIndex]);

  return (
    <div className="zylo-panel-glass" style={{ maxWidth: '400px', margin: '20px auto', textAlign: 'center' }}>
      {/* Upper Control Bar for Loop Modes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Synced Lyrics</h3>
        <button 
          onClick={() => setIsRepeatMode(!isRepeatMode)}
          style={{
            background: isRepeatMode ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.1)',
            color: isRepeatMode ? '#000' : 'var(--text-main)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            transition: 'all 0.2s ease'
          }}
        >
          {isRepeatMode ? '🔁 Repeat: ON' : '🔁 Repeat: OFF'}
        </button>
      </div>

      {/* Scrolling Lyrics Viewer Box */}
      <div 
        ref={containerRef}
        style={{
          height: '250px',
          overflowY: 'scroll',
          padding: '10px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          scrollBehavior: 'smooth'
        }}
      >
        {sampleLyrics.map((line, index) => {
          const isActive = index === activeIndex;
          return (
            <p
              key={index}
              style={{
                fontSize: isActive ? '1.25rem' : '1rem',
                fontWeight: isActive ? 'bold' : '500',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                textShadow: isActive ? '0 0 15px var(--accent-primary)' : 'none',
                transition: 'all 0.3s ease',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                opacity: isActive ? 1 : 0.4
              }}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
};
