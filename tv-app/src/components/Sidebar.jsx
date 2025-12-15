import React from 'react';

const Sidebar = ({ 
  categories, 
  activeCategories, 
  toggleCategory, 
  selectAll, 
  decade, 
  setDecade, 
  power,
  changeChannel,
  adjustVolume,
  onPowerToggle
}) => {
  const decades = ['50s', '60s', '70s', '80s', '90s', '00s'];

  return (
    <div className="flex flex-col gap-4 w-[320px] h-full p-2">
      
      {/* Top Grid: Categories | Decade Stack */}
      <div className="flex gap-4 h-[450px]">
        
        {/* Categories (Left Column) */}
        <div className="flex-1 flex flex-col gap-1 text-sm font-sans">
          {categories.map(cat => (
            <div 
              key={cat} 
              onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-2 cursor-pointer hover:text-white transition-colors ${activeCategories.has(cat) ? 'text-[#0f0]' : 'text-[#666]'}`}
            >
              <div className={`w-3 h-3 border border-[#444] flex items-center justify-center text-[10px] bg-[#111]`}>
                {activeCategories.has(cat) && <span className="text-[#0f0]">✓</span>}
              </div>
              <span>{cat}</span>
              <span className="text-xs text-[#444]">({Math.floor(Math.random()*5000)})</span>
            </div>
          ))}
          
          <div className="mt-2 text-[#0f0] underline cursor-pointer text-xs" onClick={selectAll}>
            Select All | None
          </div>
        </div>

        {/* Decade Stack (Right Column) */}
        <div className="w-24 flex flex-col gap-2 items-center">
           {decades.map(dec => (
             <div 
               key={dec}
               onClick={() => setDecade(dec)}
               className={`relative w-20 h-16 bg-[#222] border-2 rounded-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-md ${decade === dec ? 'border-[#fff] shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-[#444]'}`}
             >
               {/* Antenna */}
               <div className="absolute -top-2 left-1/2 w-0.5 h-3 bg-[#666] -rotate-12 origin-bottom" />
               <div className="absolute -top-2 left-1/2 w-0.5 h-3 bg-[#666] rotate-12 origin-bottom" />
               
               {/* Screen Content */}
               <div className={`w-full h-full bg-[#111] m-0.5 rounded flex items-center justify-center overflow-hidden relative`}>
                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzIiBoZWlnaHQ9IjMiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')]" />
                  
                  {/* Decade Logo Style */}
                  <div className="z-10 text-center leading-none transform -rotate-6">
                    <span className="text-[8px] text-blue-400 block font-serif">MY</span>
                    <span className="text-lg font-black text-[#ffd700] drop-shadow-md block">{dec}</span>
                    <span className="text-[8px] text-orange-400 block font-serif">TV!</span>
                  </div>
               </div>
               
               {/* Knobs */}
               <div className="absolute right-1 top-2 w-1 h-1 bg-[#555] rounded-full" />
               <div className="absolute right-1 top-4 w-1 h-1 bg-[#555] rounded-full" />
             </div>
           ))}
        </div>
      </div>

      {/* Remote Control Section */}
      <div className="bg-gradient-to-b from-[#ccc] to-[#999] w-32 ml-auto mr-auto p-2 rounded-[15px] shadow-xl border-b-4 border-[#666] flex flex-col gap-2 relative">
        <div className="w-full h-4 bg-[#222] rounded-t-lg mb-1" /> {/* IR Blaster */}
        
        <button 
          onClick={onPowerToggle}
          className="bg-gradient-to-b from-[#ddd] to-[#bbb] text-[#0f0] font-bold py-1 rounded shadow-sm border border-[#aaa] active:bg-[#ccc]"
        >
          POWER
        </button>
        
        <div className="flex flex-col gap-1">
          <button onClick={() => changeChannel(1)} className="bg-gradient-to-b from-[#ddd] to-[#bbb] py-1 rounded-full shadow-sm border border-[#aaa] text-xs font-bold">CH ▲</button>
          <button onClick={() => changeChannel(-1)} className="bg-gradient-to-b from-[#ddd] to-[#bbb] py-1 rounded-full shadow-sm border border-[#aaa] text-xs font-bold">CH ▼</button>
        </div>

        <div className="flex flex-col gap-1">
          <button onClick={() => adjustVolume(1)} className="bg-gradient-to-b from-[#ddd] to-[#bbb] py-1 rounded-full shadow-sm border border-[#aaa] text-xs font-bold">VOL +</button>
          <button onClick={() => adjustVolume(-1)} className="bg-gradient-to-b from-[#ddd] to-[#bbb] py-1 rounded-full shadow-sm border border-[#aaa] text-xs font-bold">VOL -</button>
        </div>

        <button className="bg-gradient-to-b from-[#aaa] to-[#888] py-1 rounded shadow-sm border border-[#777] text-xs font-bold">MENU</button>
      </div>
      
      {/* Donate Button */}
      <button className="bg-[#4a6fa5] text-white font-bold py-2 px-4 rounded shadow-lg flex items-center justify-center gap-2 mt-auto w-full border-b-4 border-[#2c4b75] active:translate-y-1 active:border-b-0">
        <span>☕</span> Donate a coffee
      </button>

      <div className="text-[#0f0] text-[10px] font-mono text-center">
        Last updated: 12/2025 [ 45215 channels ]
      </div>
    </div>
  );
};

export default Sidebar;
