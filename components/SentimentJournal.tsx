import React, { useState, useEffect } from 'react';
import { BookHeart, Save, Trash2, CheckCircle, Music } from 'lucide-react';

// --- Interfaces ---
interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
}

interface SentimentJournalProps {
  activeTrack: TrackMetadata | null;
}

export const SentimentJournal: React.FC<SentimentJournalProps> = ({ activeTrack }) => {
  const [journalText, setJournalText] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Storage key generator based on unique track ID
  const getStorageKey = (trackId: string) => `zylo_journal_track_${trackId}`;

  // Load existing journal entry when the active track changes
  useEffect(() => {
    if (activeTrack) {
      const cachedEntry = localStorage.getItem(getStorageKey(activeTrack.id));
      setJournalText(cachedEntry || '');
      setIsSaved(false);
    }
  }, [activeTrack]);

  // Save entry to the browser's localStorage cache
  const handleSave = () => {
    if (!activeTrack) return;
    
    if (journalText.trim() === '') {
      handleDelete();
      return;
    }

    localStorage.setItem(getStorageKey(activeTrack.id), journalText);
    setIsSaved(true);
    
    // Reset "Saved" feedback state after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Clear entry from cache and state
  const handleDelete = () => {
    if (!activeTrack) return;
    localStorage.removeItem(getStorageKey(activeTrack.id));
    setJournalText('');
    setIsSaved(false);
  };

  // Empty state if no track is playing
  if (!activeTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-[#0d0b14] border border-purple-900/20 rounded-xl text-slate-400">
        <Music className="w-8 h-8 mb-2 text-purple-500 animate-pulse" />
        <p className="text-sm font-medium">No track actively playing.</p>
        <p className="text-xs text-slate-500 mt-1">Play a song to write down your thoughts.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 bg-[#0d0b14] border border-purple-900/30 rounded-xl text-slate-100 shadow-xl max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-purple-900/40">
        <div className="flex items-center gap-2">
          <BookHeart className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
            Sentiment Journal
          </h3>
        </div>
        <span className="text-[10px] bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/20">
          Local Cache Secure
        </span>
      </div>

      {/* Active Track Info Sub-banner */}
      <div className="p-2.5 mb-4 rounded-lg bg-purple-950/20 border border-purple-500/10 flex items-center gap-3">
        {activeTrack.albumArt ? (
          <img 
            src={activeTrack.albumArt} 
            alt={activeTrack.title} 
            className="w-10 h-10 rounded object-cover shadow-md"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
            🎵
          </div>
        )}
        <div className="overflow-hidden">
          <h4 className="text-xs font-bold text-white truncate">{activeTrack.title}</h4>
          <p className="text-[11px] text-slate-400 truncate">{activeTrack.artist}</p>
        </div>
      </div>

      {/* Secure Text Box Input */}
      <div className="flex-1 min-h-[120px] relative">
        <textarea
          value={journalText}
          onChange={(e) => {
            setJournalText(e.target.value);
            if (isSaved) setIsSaved(false);
          }}
          placeholder="How does this track make you feel? Capture your mood, thoughts, or memories..."
          className="w-full h-full p-3 text-sm bg-[#13101c] text-slate-200 placeholder-slate-500 rounded-lg border border-purple-900/50 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-all duration-200 scrollbar-thin scrollbar-thumb-purple-900"
        />
      </div>

      {/* Control Actions Panel */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-purple-900/20">
        <button
          onClick={handleDelete}
          disabled={!journalText}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-400 rounded transition-colors duration-150"
          title="Delete entry"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold shadow transition-all duration-200 ${
            isSaved
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Note
            </>
          )}
        </button>
      </div>
    </div>
  );
};
