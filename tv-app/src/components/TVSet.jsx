import React from 'react';

const TVSet = ({ power, children, onPowerToggle, currentYear, decade, setYear }) => {
  const startYear = parseInt(decade === '00s' ? 2000 : decade === '90s' ? 1990 : 1980);
  const years = Array.from({length: 10}, (_, i) => startYear + i);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Main TV Bezel */}
      <div className="relative w-[720px] h-[540px] bg-gradient-to-r from-[#e8e8e8] via-[#f2f2f2] to-[#dcdcdc] rounded-[10px] p-8 shadow-2xl flex flex-col z-10 border-b-4 border-[#999]">
        
        {/* Screen Bezel */}
        <div className="flex-grow bg-[#111] rounded-[4px] p-6 relative overflow-hidden shadow-[inset_0_0_15px_rgba(0,0,0,1)] border border-[#333]">
          
          {/* Actual Screen Area with CRT Distortion */}
          <div className="relative w-full h-full bg-black overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
            
            {/* Curvature & Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none z-40 rounded-[20px] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]" />
            
            <div className={`w-full h-full transition-all duration-300 ${power ? 'animate-[turn-on_0.4s_ease-out]' : 'opacity-0 scale-y-0'}`}>
              
              {/* Scanlines */}
              <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />
              
              {/* Chromatic Aberration & RGB Split */}
              <div className="w-full h-full relative overflow-hidden filter contrast-125 saturate-110">
                {children}
                
                {/* Screen Glare */}
                <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.03)_0%,transparent_30%)]" />
              </div>

            </div>
            
            {!power && <div className="absolute inset-0 z-50 bg-[#050505]" />}
          </div>
        </div>

        {/* Bottom Control Strip */}
        <div className="h-12 mt-2 flex items-center justify-center relative">
          <div className="flex gap-3 items-center bg-[#d4d4d4] px-4 py-1 rounded-full border border-[#bbb] shadow-inner">
             <div className="text-[8px] font-bold text-[#666] absolute -top-3 left-14">MENU</div>
             <div className="text-[8px] font-bold text-[#666] absolute -top-3 left-24">VOL</div>
             <div className="text-[8px] font-bold text-[#666] absolute -top-3 left-36">CH</div>
             
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-br from-[#ccc] to-[#999] border border-[#888] shadow-sm active:scale-95 cursor-pointer hover:bg-[#fff]" />
             ))}
             
             <div className={`w-3 h-3 rounded-full border border-black/30 transition-all duration-300 ml-2 ${power ? 'bg-[#0f0] shadow-[0_0_8px_#0f0]' : 'bg-[#242]'}`} />
             
             <button 
               onClick={onPowerToggle}
               className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e0e0e0] to-[#bdbdbd] border border-[#999] shadow-md active:scale-95 ml-2 flex items-center justify-center hover:brightness-110"
               title="Power Toggle (Space)"
             >
               <div className="w-4 h-0.5 bg-[#666]" />
             </button>
          </div>

          <div className="absolute right-0 bottom-2 transform rotate-[-5deg]">
             <div className="text-blue-500 font-black text-2xl font-serif leading-none" style={{textShadow: '2px 2px 0 #fff'}}>
               My<br/>
               <span className="text-4xl">{decade}</span><br/>
               <span className="text-orange-400">TV!</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Textured Base */}
      <div className="w-[700px] bg-[#1a1a1a] p-4 rounded-b-xl shadow-2xl mt-[-5px] z-0 border-t-8 border-[#333] relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
        
        <div className="flex justify-between px-6 relative z-10 font-black font-mono text-xl tracking-widest">
           {years.map(year => (
             <span 
               key={year}
               onClick={() => setYear(year)}
               className={`cursor-pointer transition-all hover:scale-110 ${currentYear === year ? 'text-[#0f0] drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]' : 'text-[#555] hover:text-[#888]'}`}
             >
               {year}
             </span>
           ))}
           <span className="text-[#ff3333] cursor-help" title="Keyboard Shortcuts: Space=Power, Arrows=CH/VOL">?</span>
        </div>

        <div className="mt-3 bg-black border border-[#333] h-8 relative overflow-hidden rounded-sm shadow-inner">
           <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />
           <div id="marquee-container" className="flex items-center h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default TVSet;
