import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioCore';

// Define the structure of a custom color palette
interface ThemePalette {
  bgPrimary: string;
  bgSidebar: string;
  accentPrimary: string;
  accentSecondary: string;
}

// Preset custom profiles for our Smart-Adaptive Mode mapping
const artistThemes: Record<string, ThemePalette> = {
  'Olivia Rodrigo': {
    bgPrimary: '#2D1226',       /* Deep plum/magenta base */
    bgSidebar: '#4A1D3E',       /* Muted berry sidebar */
    accentPrimary: '#EC4899',   /* Vibrant Olivia pink */
    accentSecondary: '#F472B6'  /* Pastel accent pink */
  },
  'Billie Eilish': {
    bgPrimary: '#060B11',       /* Dark midnight ocean black */
    bgSidebar: '#0D1520',       /* Immersive deep-sea navy */
    accentPrimary: '#10B981',   /* Neon Billie green */
    accentSecondary: '#059669'  /* Darker emerald tint */
  },
  'Default': {
    bgPrimary: '#0b0f19',       /* Zylo original deep space blue */
    bgSidebar: '#111827',       /* Dark charcoal blue */
    accentPrimary: '#4f46e5',   /* Zylo signature purple */
    accentSecondary: '#06b6d4'  /* Zylo signature blue */
  }
};

export const AdaptiveTheme: React.FC = () => {
  const { currentTrack } = useAudio();
  const [isSmartMode, setIsSmartMode] = useState<boolean>(true);
  const [manualColor, setManualColor] = useState<string>('#4f46e5');

  // Apply chosen color properties to the HTML document root dynamically
  const applyTheme = (palette: ThemePalette) => {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', palette.bgPrimary);
    root.style.setProperty('--bg-sidebar', palette.bgSidebar);
    root.style.setProperty('--accent-primary', palette.accentPrimary);
    root.style.setProperty('--accent-secondary', palette.accentSecondary);
  };

  // Smart-Adaptive monitoring hook: changes values when current track changes
  useEffect(() => {
    if (!isSmartMode) return;

    if (currentTrack && artistThemes[currentTrack.artist]) {
      applyTheme(artistThemes[currentTrack.artist]);
    } else {
      applyTheme(artistThemes['Default']);
    }
  }, [currentTrack, isSmartMode]);

  // Manual configuration handler
  const handleManualColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedColor = e.target.value;
    setManualColor(selectedColor);
    
    if (!isSmartMode) {
      applyTheme({
        bgPrimary: '#0f172a',       /* Stable dark slate slate background */
        bgSidebar: '#1e293b',      /* Charcoal sidebar */
        accentPrimary: selectedColor,
        accentSecondary: '#94a3b8' /* Balanced neutral contrast element */
      });
    }
  };

  return (
    <div className="zylo-panel-glass" style={{ maxWidth: '400px', margin: '20px auto' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Theme Control Workspace</h3>
      
      {/* Mode Selectors */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button 
          onClick={() => setIsSmartMode(true)}
          className="zylo-btn-primary"
          style={{ 
            flex: 1, 
            opacity: isSmartMode ? 1 : 0.5,
            background: isSmartMode ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : '#374151'
          }}
        >
          ✨ Smart Artist Mode
        </button>
        <button 
          onClick={() => setIsSmartMode(false)}
          className="zylo-btn-primary"
          style={{ 
            flex: 1, 
            opacity: !isSmartMode ? 1 : 0.5,
            background: !isSmartMode ? 'var(--accent-primary)' : '#374151'
          }}
        >
          🎨 Manual Mode
        </button>
      </div>

      {/* Visual State Indicators */}
      {isSmartMode ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
          Currently syncing look with artist metadata. Try tracking between an <span style={{color: '#ec4899'}}>Olivia</span> track or a <span style={{color: '#10b981'}}>Billie</span> track to check adjustments!
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.9rem' }}>Pick Custom Primary Accent:</span>
          <input 
            type="color" 
            value={manualColor} 
            onChange={handleManualColorChange} 
            style={{ border: 'none', background: 'none', cursor: 'pointer', width: '40px', height: '40px' }}
          />
        </div>
      )}
    </div>
  );
};
