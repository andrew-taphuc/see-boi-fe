import React from "react";

// Mapping địa chi sang chữ Hán
const DIA_CHI_HAN = {
  Tý: "子",
  Sửu: "丑",
  Dần: "寅",
  Mão: "卯",
  Thìn: "辰",
  Tỵ: "巳",
  Ngọ: "午",
  Mùi: "未",
  Thân: "申",
  Dậu: "酉",
  Tuất: "戌",
  Hợi: "亥",
};

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
      className={`relative border border-yellow-700/50 bg-[#FFFBF0] flex flex-col justify-between overflow-hidden
      ${isMobile ? "min-h-[160px] mb-3 rounded shadow-sm" : "min-h-[140px]"} 
      ${
        onClick
          ? "cursor-pointer hover:bg-yellow-50 hover:shadow-md transition-all"
          : ""
      }
      ${cssClass}`}
    >
      {/* Chữ Hán trang trí nền */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-serif text-yellow-800/3 select-none">
          {DIA_CHI_HAN[data.diaChi] || "宮"}
        </span>
      </div>

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
            <span
              key={i}
              className="font-medium text-black whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {sao}
            </span>
          ))}
        </div>

        {/* Chính Tinh (Ở giữa) */}
        <div className="flex flex-col items-center justify-center w-1/3 text-center gap-0.5">
          {data.chinhTinh.length > 0 ? (
            data.chinhTinh.map((sao, i) => (
              <span
                key={i}
                className={`font-bold uppercase text-red-700 block whitespace-nowrap ${
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
            <span
              key={i}
              className="font-medium text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis"
            >
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
