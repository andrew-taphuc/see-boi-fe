import React from "react";

/**
 * Component hiển thị 5 chỉ số Aspects dưới dạng thanh progress bar
 * @param {Object} aspects - Dữ liệu aspects từ Backend
 * @param {number} aspects.personality - Tính cách (0-10)
 * @param {number} aspects.career - Sự nghiệp (0-10)
 * @param {number} aspects.love - Tình cảm (0-10)
 * @param {number} aspects.wealth - Tài lộc (0-10)
 * @param {number} aspects.health - Sức khỏe (0-10)
 */
const AspectsBars = ({ aspects }) => {
  if (!aspects) return null;

  // Danh sách 5 chỉ số với màu sắc đỏ-vàng
  const aspectsList = [
    {
      key: "personality",
      label: "Tính Cách",
      color: "bg-red-700",
      lightColor: "bg-red-100",
    },
    {
      key: "career",
      label: "Sự Nghiệp",
      color: "bg-yellow-600",
      lightColor: "bg-yellow-100",
    },
    {
      key: "love",
      label: "Tình Cảm",
      color: "bg-red-600",
      lightColor: "bg-red-50",
    },
    {
      key: "wealth",
      label: "Tài Lộc",
      color: "bg-yellow-700",
      lightColor: "bg-yellow-50",
    },
    {
      key: "health",
      label: "Sức Khỏe",
      color: "bg-red-800",
      lightColor: "bg-red-50",
    },
  ];

  // Hàm đánh giá mức độ
  const getLevel = (score) => {
    if (score >= 9) return "Xuất sắc";
    if (score >= 7) return "Tốt";
    if (score >= 5) return "Trung bình";
    if (score >= 3) return "Khá yếu";
    return "Yếu";
  };

  return (
    <div className="bg-[#fdfbf7] rounded p-4 md:p-6 border-4 border-yellow-700 shadow-lg mb-6">
      {/* Tiêu đề */}
      <div className="bg-red-900 -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-4 p-3 border-b-4 border-yellow-600">
        <h3 className="font-['Playfair_Display'] text-center text-xl md:text-2xl font-bold text-yellow-400 uppercase tracking-widest">
          Chỉ Số Vận Mệnh
        </h3>
      </div>

      {/* Danh sách các chỉ số */}
      <div className="space-y-4">
        {aspectsList.map((aspect) => {
          const score = aspects[aspect.key] || 0;
          const percentage = (score / 10) * 100;
          const level = getLevel(score);

          return (
            <div key={aspect.key} className="space-y-2">
              {/* Label và điểm */}
              <div className="flex items-center justify-between ">
                <span className="font-['Playfair_Display'] font-bold text-red-800 text-sm md:text-base">
                  {aspect.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-['Playfair_Display'] text-xs md:text-sm text-gray-600 font-medium">
                    {level}
                  </span>
                  <span className="font-['Playfair_Display'] font-bold text-lg text-red-900">
                    {score}/10
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div
                className={`w-full h-3 md:h-4 rounded-full ${aspect.lightColor} overflow-hidden`}
              >
                <div
                  className={`h-full ${aspect.color} transition-all duration-1000 ease-out rounded-full shadow-inner`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chú thích */}
      <div className="mt-4 pt-4 border-t border-yellow-300">
        <p className="text-xs md:text-sm text-gray-600 text-center italic font-['Playfair_Display']">
          Chỉ số càng cao, vận mệnh ở lĩnh vực đó càng thuận lợi
        </p>
      </div>
    </div>
  );
};

export default AspectsBars;
