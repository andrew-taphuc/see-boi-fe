import React, { useState } from 'react';
import { Sparkles, Moon, Star, Gem } from 'lucide-react';

const BocThamVanMay = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState(null);

  const fortunes = [
    { text: "Vận may đang đến với bạn! Hãy tin tưởng vào bản thân.", color: "from-yellow-400 to-orange-500" },
    { text: "Thời cơ tốt đang chờ đợi. Hãy mạnh dạn nắm bắt.", color: "from-purple-400 to-pink-500" },
    { text: "Năng lượng tích cực đang bao quanh bạn. Hãy lan tỏa điều tốt đẹp.", color: "from-blue-400 to-indigo-500" },
    { text: "Những điều bất ngờ tốt đẹp sắp xảy ra. Hãy mở lòng đón nhận.", color: "from-green-400 to-emerald-500" },
    { text: "Sự kiên nhẫn của bạn sẽ được đền đáp. Hãy tiếp tục cố gắng.", color: "from-rose-400 to-red-500" },
    { text: "Tình yêu và hạnh phúc đang trên đường đến với bạn.", color: "from-pink-400 to-rose-500" },
    { text: "Thành công lớn đang chờ đợi bạn ở phía trước.", color: "from-amber-400 to-yellow-500" },
    { text: "Năng lượng tâm linh đang bảo vệ và hướng dẫn bạn.", color: "from-violet-400 to-purple-500" }
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
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl shadow-2xl overflow-hidden mb-4 relative">
      {/* Decorative elements */}
      <div className="absolute top-2 left-2 opacity-30">
        <Star className="text-yellow-300 animate-pulse" size={16} />
      </div>
      <div className="absolute top-3 right-3 opacity-30">
        <Moon className="text-blue-300" size={18} />
      </div>
      <div className="absolute bottom-2 left-3 opacity-20">
        <Gem className="text-pink-300" size={20} />
      </div>
      <div className="absolute bottom-3 right-2 opacity-30">
        <Sparkles className="text-yellow-200 animate-pulse" size={18} />
      </div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="text-yellow-300" size={20} />
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200">
              Bốc Thăm Vận May
            </h2>
            <Sparkles className="text-yellow-300" size={20} />
          </div>
          <p className="text-purple-200 text-xs">Khám phá vận may của bạn hôm nay</p>
        </div>

        {/* Card area */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 mb-3 border border-purple-400/30">
          {!result && !isDrawing && (
            <div className="text-center py-3">
              <div className="w-20 h-28 mx-auto bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-lg flex items-center justify-center mb-2 border-2 border-yellow-400/50">
                <Star className="text-yellow-300" size={32} />
              </div>
              <p className="text-purple-200 text-xs mb-2">Nhấn vào nút bên dưới để bốc thăm</p>
            </div>
          )}

          {isDrawing && (
            <div className="text-center py-3">
              <div className="w-20 h-28 mx-auto bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg shadow-lg flex items-center justify-center mb-2 border-2 border-yellow-400/50 animate-pulse">
                <Sparkles className="text-yellow-300 animate-spin" size={32} />
              </div>
              <p className="text-purple-200 text-sm animate-pulse">Đang bốc thăm...</p>
            </div>
          )}

          {result && (
            <div className="text-center py-2">
              <div className={`w-20 h-28 mx-auto bg-gradient-to-br ${result.color} rounded-lg shadow-lg flex items-center justify-center mb-2 border-2 border-yellow-400/50 transform transition-all duration-500 hover:scale-105`}>
                <Star className="text-white" size={32} />
              </div>
              <p className={`text-white text-sm font-semibold mb-1 bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                Vận May Của Bạn
              </p>
              <p className="text-purple-100 text-xs leading-relaxed px-2">
                {result.text}
              </p>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleDraw}
          disabled={isDrawing}
          className="w-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm"
        >
          {isDrawing ? (
            <>
              <Sparkles className="animate-spin" size={16} />
              <span>Đang bốc thăm...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Bốc Thăm Ngay</span>
            </>
          )}
        </button>

        {/* Footer decoration */}
        <div className="mt-2 text-center">
          <p className="text-purple-300/70 text-xs flex items-center justify-center gap-1">
            <Moon size={12} />
            <span>Mỗi ngày một vận may mới</span>
            <Moon size={12} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default BocThamVanMay;

