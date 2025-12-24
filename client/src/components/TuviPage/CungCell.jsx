import React from "react";

const CungCell = ({ data, cssClass = "", isMobile = false, onClick }) => {
  if (!data)
    return (
      <div
        className={`border border-yellow-700/30 bg-[#FFFBF0] ${cssClass}`}
      ></div>
    );

  return (
    <div
      onClick={() => onClick && onClick(data)}
      className={`relative border border-yellow-700/50 bg-[#FFFBF0] flex flex-col justify-between 
      ${isMobile ? "min-h-[160px] mb-3 rounded shadow-sm" : "min-h-[140px]"} 
      ${
        onClick
          ? "cursor-pointer hover:bg-yellow-50 hover:shadow-md transition-all"
          : ""
      }
      ${cssClass}`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-2 py-1 ${
          data.isThan
            ? "bg-yellow-200 text-red-800"
            : "bg-yellow-800/10 text-gray-700"
        } ${isMobile ? "rounded-t" : ""}`}
      >
        <span className="font-['Playfair_Display'] font-bold uppercase text-xs md:text-xs">
          {data.tenCung}
        </span>
        <span className="text-xs text-gray-500 font-bold font-serif">
          {data.diaChi}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 flex justify-between px-1 py-2 text-[11px] leading-tight">
        {/* Sao Tốt (Bên trái) */}
        <div className="flex flex-col gap-0.5 text-left w-1/3">
          {data.phuTinh.tot.map((sao, i) => (
            <span key={i} className="font-medium text-black">
              {sao}
            </span>
          ))}
        </div>

        {/* Chính Tinh (Ở giữa) */}
        <div className="flex flex-col items-center w-1/3 text-center">
          {data.chinhTinh.length > 0 ? (
            data.chinhTinh.map((sao, i) => (
              <span
                key={i}
                className={`font-bold uppercase text-red-700 block ${
                  data.chinhTinh.length > 1 ? "text-[11px]" : "text-sm"
                }`}
              >
                {sao.name}{" "}
                <span className="text-[9px] text-gray-400">({sao.daq})</span>
              </span>
            ))
          ) : (
            <span className="text-gray-300 text-[10px] italic">
              Vô Chính Diệu
            </span>
          )}
        </div>

        {/* Sao Xấu (Bên phải) */}
        <div className="flex flex-col gap-0.5 text-right w-1/3">
          {data.phuTinh.xau.map((sao, i) => (
            <span key={i} className="font-medium text-gray-500">
              {sao}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end text-[10px] font-bold px-2 py-1 mt-1 border-t border-dashed border-yellow-700/30">
        <span className="text-gray-400">{data.tieuVan}</span>
        <span className="bg-yellow-600 text-white px-1.5 rounded-sm">
          {data.daiVan}
        </span>
      </div>
    </div>
  );
};

export default CungCell;
