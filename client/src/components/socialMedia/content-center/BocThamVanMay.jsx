import React, { useState } from 'react';
import { Sparkles, Moon, Star, Gem, ChevronDown, ChevronUp } from 'lucide-react';

const BocThamVanMay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState(null);

  const fortunes = [
    { text: "Vận may đang đến với bạn! Hãy tin tưởng vào bản thân.", color: "from-yellow-400 to-orange-500", glow: "shadow-yellow-500/50" },
    { text: "Thời cơ tốt đang chờ đợi. Hãy mạnh dạn nắm bắt.", color: "from-purple-400 to-pink-500", glow: "shadow-purple-500/50" },
    { text: "Năng lượng tích cực đang bao quanh bạn. Hãy lan tỏa điều tốt đẹp.", color: "from-blue-400 to-indigo-500", glow: "shadow-blue-500/50" },
    { text: "Những điều bất ngờ tốt đẹp sắp xảy ra. Hãy mở lòng đón nhận.", color: "from-green-400 to-emerald-500", glow: "shadow-green-500/50" },
    { text: "Sự kiên nhẫn của bạn sẽ được đền đáp. Hãy tiếp tục cố gắng.", color: "from-rose-400 to-red-500", glow: "shadow-rose-500/50" },
    { text: "Tình yêu và hạnh phúc đang trên đường đến với bạn.", color: "from-pink-400 to-rose-500", glow: "shadow-pink-500/50" },
    { text: "Thành công lớn đang chờ đợi bạn ở phía trước.", color: "from-amber-400 to-yellow-500", glow: "shadow-amber-500/50" },
    { text: "Năng lượng tâm linh đang bảo vệ và hướng dẫn bạn.", color: "from-violet-400 to-purple-500", glow: "shadow-violet-500/50" }
  ];

  const handleDraw = () => {
    setIsDrawing(true);
    setResult(null);
    
    // Animation delay
    setTimeout(() => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      setResult(randomFortune);
      setIsDrawing(false);
    }, 2000);
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-3xl shadow-2xl">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 via-transparent to-yellow-900/20 animate-pulse"></div>
      
      {/* Floating decorative elements with glow */}
      <div className="absolute top-4 left-4 opacity-40 animate-float">
        <div className="relative">
          <Star className="text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]" size={18} />
        </div>
      </div>
      <div className="absolute top-6 right-6 opacity-35 animate-float-delayed">
        <Moon className="text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.6)]" size={20} />
      </div>
      <div className="absolute bottom-5 left-6 opacity-30 animate-float">
        <Gem className="text-pink-300 drop-shadow-[0_0_8px_rgba(249,168,212,0.6)]" size={22} />
      </div>
      <div className="absolute bottom-6 right-5 opacity-40 animate-float-delayed">
        <Sparkles className="text-yellow-200 drop-shadow-[0_0_8px_rgba(254,240,138,0.7)]" size={19} />
      </div>

      {/* Glassmorphism container */}
      <div 
        className="relative z-10 backdrop-blur-sm cursor-pointer transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`p-6 transition-all duration-500 ${isExpanded ? '' : 'pb-4'}`}>
          {/* Header with enhanced typography */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="relative">
                <Sparkles className="text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse" size={24} />
                <div className="absolute inset-0 bg-yellow-300/20 blur-xl"></div>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 drop-shadow-lg">
                  Bốc Thăm Vận May
                </span>
              </h2>
              <div className="relative">
                <Sparkles className="text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse" size={24} />
                <div className="absolute inset-0 bg-yellow-300/20 blur-xl"></div>
              </div>
            </div>
            <p className="text-purple-200/90 text-sm font-medium tracking-wide">Khám phá vận may của bạn hôm nay</p>
          </div>

          {/* Nested bouncing arrows - only show when collapsed */}
          {!isExpanded && (
            <div className="flex items-center justify-center mt-3">
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Outer arrow */}
                <ChevronDown 
                  className="absolute text-yellow-300/80 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)] animate-bounce" 
                  size={24} 
                />
                {/* Inner arrow - smaller and offset */}
                <ChevronDown 
                  className="absolute text-yellow-300/60 drop-shadow-[0_0_6px_rgba(253,224,71,0.5)] animate-bounce" 
                  size={16} 
                  style={{ animationDelay: '0.2s', transform: 'translate(2px, 2px)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-6 pb-6 animate-fade-in">
            {/* Premium card area with glassmorphism */}
            <div className="relative mb-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
              
              <div className="relative p-5">
                {!result && !isDrawing && (
                  <div className="text-center py-6">
                    <div className="relative w-24 h-32 mx-auto mb-4 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-700/80 to-purple-800/80 rounded-xl shadow-2xl border-2 border-yellow-400/60 blur-sm group-hover:blur-md transition-all duration-300"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 rounded-xl shadow-2xl border-2 border-yellow-400/60 flex items-center justify-center backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                        <Star className="text-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,1)]" size={40} />
                      </div>
                    </div>
                    <p className="text-purple-200/90 text-sm font-medium">Nhấn vào nút bên dưới để bốc thăm</p>
                  </div>
                )}

                {isDrawing && (
                  <div className="text-center py-6">
                    <div className="relative w-24 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 via-indigo-700/80 to-purple-800/80 rounded-xl shadow-2xl border-2 border-yellow-400/60 blur-sm animate-pulse"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-800 rounded-xl shadow-2xl border-2 border-yellow-400/60 flex items-center justify-center backdrop-blur-sm animate-pulse">
                        <Sparkles className="text-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,1)] animate-spin" size={40} />
                      </div>
                    </div>
                    <p className="text-purple-200/90 text-sm font-medium animate-pulse">Đang bốc thăm...</p>
                  </div>
                )}

                {result && (
                  <div className="text-center py-4 animate-fade-in">
                    <div className={`relative w-24 h-32 mx-auto mb-4 group`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${result.color} rounded-xl shadow-2xl border-2 border-yellow-400/60 blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className={`relative w-full h-full bg-gradient-to-br ${result.color} rounded-xl shadow-2xl border-2 border-yellow-400/60 flex items-center justify-center backdrop-blur-sm transform transition-all duration-500 hover:scale-110 ${result.glow}`}>
                        <Star className="text-white drop-shadow-[0_0_16px_rgba(255,255,255,0.8)]" size={40} />
                      </div>
                    </div>
                    <p className={`text-sm font-bold mb-2 tracking-wide`}>
                      <span className={`text-transparent bg-clip-text bg-gradient-to-r ${result.color}`}>
                        Vận May Của Bạn
                      </span>
                    </p>
                    <p className="text-white/95 text-sm leading-relaxed px-3 font-medium">
                      {result.text}
                    </p>
                  </div>
                )}
              </div>
            </div>

              {/* Premium button with glow effect */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDraw();
                }}
                disabled={isDrawing}
                className="relative w-full group overflow-hidden rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Button glow background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-75 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                
                {/* Button content */}
                <div className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 text-sm shadow-lg border border-white/20">
                  {isDrawing ? (
                    <>
                      <Sparkles className="animate-spin drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={18} />
                      <span className="tracking-wide">Đang bốc thăm...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={18} />
                      <span className="tracking-wide">Bốc Thăm Ngay</span>
                    </>
                  )}
                </div>
              </button>

              {/* Elegant footer */}
              <div className="mt-4 text-center">
                <p className="text-purple-300/80 text-xs font-medium flex items-center justify-center gap-2 tracking-wide">
                  <Moon size={13} className="drop-shadow-[0_0_4px_rgba(196,181,253,0.6)]" />
                  <span>Mỗi ngày một vận may mới</span>
                  <Moon size={13} className="drop-shadow-[0_0_4px_rgba(196,181,253,0.6)]" />
                </p>
              </div>

              {/* Nested bouncing arrows - at the bottom when expanded */}
              <div className="flex items-center justify-center mt-4">
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {/* Outer arrow - pointing up */}
                  <ChevronUp 
                    className="absolute text-yellow-300/80 drop-shadow-[0_0_8px_rgba(253,224,71,0.6)] animate-bounce" 
                    size={24} 
                  />
                  {/* Inner arrow - smaller and offset */}
                  <ChevronUp 
                    className="absolute text-yellow-300/60 drop-shadow-[0_0_6px_rgba(253,224,71,0.5)] animate-bounce" 
                    size={16} 
                    style={{ animationDelay: '0.2s', transform: 'translate(2px, -2px)' }}
                  />
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default BocThamVanMay;

