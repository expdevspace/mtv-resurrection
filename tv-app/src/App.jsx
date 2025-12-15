import React, { useState, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import TVSet from './components/TVSet';
import Sidebar from './components/Sidebar';
import { CATEGORIES, MOCK_CHANNELS } from './data/content';

// Simple Audio Synth for Effects
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playBeep = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};

const playStatic = () => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const bufferSize = audioCtx.sampleRate * 0.2; // 200ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.value = 0.05;
  noise.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
};

function App() {
  // Load initial state from local storage or default
  const savedState = JSON.parse(localStorage.getItem('tvState')) || {};
  
  const [power, setPower] = useState(false); // Always start off for effect
  const [decade, setDecade] = useState(savedState.decade || '00s');
  const [currentYear, setCurrentYear] = useState(savedState.year || 2008);
  const [volume, setVolume] = useState(savedState.volume || 5);
  const [activeCategories, setActiveCategories] = useState(new Set(savedState.categories ? JSON.parse(savedState.categories) : CATEGORIES));
  
  const [channelIndex, setChannelIndex] = useState(0);
  const [staticNoise, setStaticNoise] = useState(false);
  const [osd, setOsd] = useState('');

  // Persist State
  useEffect(() => {
    localStorage.setItem('tvState', JSON.stringify({
      decade,
      year: currentYear,
      volume,
      categories: JSON.stringify(Array.from(activeCategories))
    }));
  }, [decade, currentYear, volume, activeCategories]);

  // Year validation
  useEffect(() => {
    const startYear = parseInt(decade === '00s' ? 2000 : decade === '90s' ? 1990 : 1980);
    if (currentYear < startYear || currentYear > startYear + 9) {
      setCurrentYear(startYear);
    }
  }, [decade]);

  // Channels logic
  const currentChannels = useMemo(() => {
    const all = MOCK_CHANNELS[decade] || [];
    const filtered = all.filter(ch => 
      activeCategories.has(ch.type) && 
      (!ch.year || ch.year === currentYear)
    );
    return filtered.length > 0 ? filtered : [{ title: "No Signal", artist: "Try different filters", type: "System" }];
  }, [decade, activeCategories, currentYear]);

  useEffect(() => {
    setChannelIndex(0);
    if(power) triggerStatic();
  }, [decade, activeCategories, currentYear]);

  // Effects
  const triggerStatic = () => {
    if (!power) return;
    setStaticNoise(true);
    playStatic();
    setTimeout(() => setStaticNoise(false), 400);
  };

  const showOsd = (text) => {
    setOsd(text);
    setTimeout(() => setOsd(''), 2000);
  };

  // Actions
  const handlePower = () => {
    setPower(!power);
    playBeep();
    if (!power) {
      setTimeout(() => {
        setStaticNoise(false);
        showOsd(`CH ${channelIndex + 1}`);
      }, 1000);
    }
  };

  const changeChannel = (dir) => {
    if (!power) return;
    let newIndex = channelIndex + dir;
    if (newIndex >= currentChannels.length) newIndex = 0;
    if (newIndex < 0) newIndex = currentChannels.length - 1;
    setChannelIndex(newIndex);
    triggerStatic();
    showOsd(`CH ${newIndex + 1}`);
  };

  const handleVolume = (dir) => {
    if (!power) return;
    const newVol = Math.max(0, Math.min(10, volume + dir));
    setVolume(newVol);
    showOsd(`VOL ${'|'.repeat(newVol)}`);
    playBeep();
  };

  const toggleCategory = (cat) => {
    const newSet = new Set(activeCategories);
    if (newSet.has(cat)) newSet.delete(cat);
    else newSet.add(cat);
    setActiveCategories(newSet);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.code) {
        case 'Space': 
          e.preventDefault();
          handlePower();
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeChannel(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeChannel(-1);
          break;
        case 'ArrowRight':
          handleVolume(1);
          break;
        case 'ArrowLeft':
          handleVolume(-1);
          break;
        case 'KeyM':
          handlePower(); // Use M for menu/mute if implemented
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [power, channelIndex, volume, currentChannels]); // Dependencies for closure

  const currentProg = currentChannels[channelIndex];

  // Portal Marquee
  const MarqueeContent = () => (
    <div className={`whitespace-nowrap text-[#0f0] font-mono text-lg animate-[scroll-text_15s_linear_infinite] w-full pl-[100%] ${power ? 'opacity-100' : 'opacity-0'}`}>
       {currentYear} NOW PLAYING: {currentProg.title} - {currentProg.artist} [{currentProg.type}] *** WELCOME TO THE {decade} EXPERIENCE ***
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-center p-8 scale-90 md:scale-100 h-screen overflow-hidden">
      
      {/* TV Unit */}
      <div className="flex flex-col items-center">
        <TVSet 
          power={power} 
          onPowerToggle={handlePower}
          currentYear={currentYear}
          setYear={setCurrentYear}
          decade={decade}
        >
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
            
            {/* Content Layer */}
            <div className={`absolute inset-0 transition-opacity duration-200 ${staticNoise ? 'opacity-10' : 'opacity-100'}`}>
              <div 
                className="w-full h-full flex flex-col items-center justify-center p-8 text-center"
                style={{
                  background: `hsl(${currentProg.title.length * 20}, 40%, 20%)`
                }}
              >
                <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md tracking-tighter">{currentProg.title}</h1>
                <h2 className="text-2xl text-[#ccc] mb-8 font-serif italic">{currentProg.artist}</h2>
                <div className="px-4 py-1 border border-white/30 rounded text-sm bg-black/30 backdrop-blur-sm">
                  {currentProg.type} • {currentProg.year || currentYear}
                </div>
              </div>
            </div>

            {/* Static Layer */}
            <div 
              className={`absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIvPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSI1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjMiLz48L3N2Zz4=')] opacity-0 transition-opacity duration-100 animate-[static-shift_0.2s_infinite_steps(4)] z-40 ${staticNoise ? '!opacity-80' : ''}`} 
            />

            {/* OSD */}
            {osd && (
              <div className="absolute top-12 right-12 text-[#0f0] text-4xl font-mono font-bold drop-shadow-[0_0_5px_#0f0] z-50 animate-pulse">
                {osd}
              </div>
            )}
            
          </div>
        </TVSet>
      </div>

      <Sidebar 
        categories={CATEGORIES}
        activeCategories={activeCategories}
        toggleCategory={toggleCategory}
        selectAll={() => setActiveCategories(activeCategories.size === CATEGORIES.length ? new Set() : new Set(CATEGORIES))}
        decade={decade}
        setDecade={setDecade}
        power={power}
        onPowerToggle={handlePower}
        changeChannel={changeChannel}
        adjustVolume={handleVolume}
      />
      
      {document.getElementById('marquee-container') && ReactDOM.createPortal(
        <MarqueeContent />,
        document.getElementById('marquee-container')
      )}
    </div>
  );
}

export default App;
