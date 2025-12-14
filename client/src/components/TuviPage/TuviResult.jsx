import React from "react";

// --- Component con: Ô Cung (Giữ nguyên) ---
const CungCell = ({ data, cssClass }) => {
  if (!data)
    return (
      <div
        className={`border border-yellow-700/30 bg-[#FFFBF0] ${cssClass}`}
      ></div>
    );
  return (
    <div
      className={`relative border border-yellow-700/50 bg-[#FFFBF0] p-1 flex flex-col justify-between min-h-[140px] ${cssClass}`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-1 py-0.5 ${
          data.isThan
            ? "bg-yellow-200 text-red-800"
            : "bg-yellow-800/10 text-gray-700"
        }`}
      >
        <span className="font-bold uppercase text-[10px] md:text-xs font-serif">
          {data.tenCung}
        </span>
        <span className="text-[10px] text-gray-500 font-bold">
          {data.diaChi}
        </span>
      </div>
      {/* Body */}
      <div className="flex-1 flex justify-between px-1 py-2 text-[10px] md:text-[11px] leading-tight">
        <div className="flex flex-col gap-0.5 text-left w-1/3">
          {data.phuTinh.tot.map((sao, i) => (
            <span key={i} className="font-medium text-black">
              {sao}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center w-1/3 text-center">
          {data.chinhTinh.length > 0 ? (
            data.chinhTinh.map((sao, i) => (
              <span
                key={i}
                className={`font-bold uppercase text-red-700 ${
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
        <div className="flex flex-col gap-0.5 text-right w-1/3">
          {data.phuTinh.xau.map((sao, i) => (
            <span key={i} className="font-medium text-gray-500">
              {sao}
            </span>
          ))}
        </div>
      </div>
      {/* Footer */}
      <div className="flex justify-between items-end text-[10px] font-bold px-1 mt-1 border-t border-dashed border-yellow-700/30 pt-1">
        <span className="text-gray-400">{data.tieuVan}</span>
        <span className="bg-yellow-600 text-white px-1 rounded-sm">
          {data.daiVan}
        </span>
      </div>
    </div>
  );
};

// --- Component Chính ---
const TuviResult = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;
  const getCungData = (chi) => data.cacCung.find((c) => c.diaChi === chi);

  // --- HÀM MỚI: Xử lý click ra ngoài để tắt ---
  const handleOverlayClick = (e) => {
    // Chỉ tắt khi bấm vào lớp phủ đen (currentTarget), không tắt khi bấm vào nội dung (target)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick} // <--- Gắn sự kiện click vào đây
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 md:p-4 overflow-y-auto" // Thêm cursor-pointer
    >
      <div className="relative w-full max-w-5xl bg-[#1a1a1a] rounded shadow-2xl overflow-hidden border-2 border-yellow-600 flex flex-col cursor-default">
        {" "}
        {/* Thêm cursor-default */}
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white bg-red-800 hover:bg-red-700 w-8 h-8 rounded-full font-bold border border-yellow-500 shadow-lg cursor-pointer"
        >
          ✕
        </button>
        <div className="p-1 md:p-4 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-yellow-700 scrollbar-track-gray-900">
          {/* === PHẦN 1: LƯỚI LÁ SỐ (Nền sáng) === */}
          <div className="bg-[#fdfbf7] p-2 rounded border border-yellow-600 mb-6">
            <div className="grid grid-cols-4 gap-0 border-2 border-yellow-800 bg-yellow-800 min-w-[800px]">
              {/* HÀNG 1 */}
              <CungCell data={getCungData("Tỵ")} />{" "}
              <CungCell data={getCungData("Ngọ")} />{" "}
              <CungCell data={getCungData("Mùi")} />{" "}
              <CungCell data={getCungData("Thân")} />
              {/* HÀNG 2 */}
              <CungCell data={getCungData("Thìn")} />
              <div className="col-span-2 row-span-2 bg-white flex flex-col items-center justify-center p-4 border border-yellow-700/50 relative">
                <div className="absolute inset-0 opacity-5 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Yin_yang_black_and_white_symbol.svg/1200px-Yin_yang_black_and_white_symbol.svg.png')] bg-center bg-no-repeat bg-contain pointer-events-none"></div>
                <div className="relative z-10 text-center w-full">
                  <h2 className="font-['Playfair_Display'] text-3xl font-bold text-red-800 uppercase tracking-widest mb-1">
                    Lá Số Tử Vi
                  </h2>
                  <div className="w-24 h-0.5 bg-yellow-600 mx-auto mb-4"></div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-left text-sm font-['Be_Vietnam_Pro'] text-gray-800 px-8">
                    <p>
                      <span className="font-bold text-yellow-800">Họ tên:</span>{" "}
                      {data.thienBan.hoTen}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-800">
                        Năm xem:
                      </span>{" "}
                      {data.thienBan.namXem}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-800">
                        Ngày sinh:
                      </span>{" "}
                      {data.thienBan.ngaySinh}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-800">
                        Âm lịch:
                      </span>{" "}
                      {data.thienBan.amLich}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-800">Giờ:</span>{" "}
                      {data.thienBan.gioSinh}
                    </p>
                    <p>
                      <span className="font-bold text-yellow-800">
                        Giới tính:
                      </span>{" "}
                      {data.thienBan.gioiTinh}
                    </p>
                  </div>
                  <div className="mt-6 bg-yellow-50/80 p-3 rounded border border-yellow-200 text-sm">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <p>
                        <span className="font-bold">Mệnh:</span>{" "}
                        {data.thienBan.banMenh}
                      </p>
                      <p>
                        <span className="font-bold">Cục:</span>{" "}
                        {data.thienBan.cuc}
                      </p>
                    </div>
                    <p className="mt-2 font-bold text-red-700 uppercase text-xs tracking-wider">
                      {data.thienBan.tuongQuan}
                    </p>
                  </div>
                </div>
              </div>
              <CungCell data={getCungData("Dậu")} />
              {/* HÀNG 3 */}
              <CungCell data={getCungData("Mão")} />{" "}
              <CungCell data={getCungData("Tuất")} />
              {/* HÀNG 4 */}
              <CungCell data={getCungData("Dần")} />{" "}
              <CungCell data={getCungData("Sửu")} />{" "}
              <CungCell data={getCungData("Tý")} />{" "}
              <CungCell data={getCungData("Hợi")} />
            </div>
          </div>

          {/* === PHẦN 2: BÌNH GIẢI (Nền tối - Dark Mode) === */}
          {data.binhGiai && (
            <div className="space-y-6 text-gray-300 font-['Be_Vietnam_Pro']">
              {/* Bình giải tổng quan */}
              <div className="bg-[#222] rounded border border-yellow-700 overflow-hidden">
                <div className="bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-red-900/90 p-3 border-b border-yellow-600 text-center">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-yellow-400 uppercase tracking-widest drop-shadow-md">
                    Bình Giải Tổng Quan
                  </h3>
                </div>

                <div className="p-4 space-y-6">
                  {data.binhGiai.tongQuan.map((item, index) => (
                    <div
                      key={index}
                      className="pb-4 border-b border-gray-700 last:border-0 last:pb-0"
                    >
                      <h4 className="text-[#8cb4ff] font-bold text-lg mb-2">
                        {item.tieuDe}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed text-justify mb-2">
                        {item.noiDung}
                      </p>
                      <p className="text-right text-xs text-gray-500 italic">
                        — {item.nguon}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bình giải 12 Cung (k cần thì bỏ) */}
              <div className="rounded border border-yellow-700 overflow-hidden mt-6">
                <div className="bg-gradient-to-r from-yellow-900 to-red-900 p-3 border-b border-yellow-600 text-center">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-white uppercase tracking-widest drop-shadow-md">
                    Bình Giải 12 Cung
                  </h3>
                </div>
                <div className="p-4 text-center text-gray-400 italic">
                  Nội dung chi tiết 12 cung sẽ hiển thị ở đây... (không cần thì
                  bỏ)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuviResult;
