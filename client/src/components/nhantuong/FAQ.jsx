import { useState } from "react";
import AddCircle from "@assets/nhantuong/add_circle.svg";
import Minus from "@assets/nhantuong/minus.svg";

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "Dữ liệu khuôn mặt của tôi có được lưu trữ lâu không?",
      answer: "Không. Ảnh và dữ liệu cá nhân của bạn chỉ được lưu trên máy chủ tối đa 01 giờ để xử lý. Sau thời gian này, toàn bộ dữ liệu sẽ được xóa vĩnh viễn, không thể khôi phục.",
    },
    {
      id: 2,
      question: "nhantuong.vn có chia sẻ dữ liệu của tôi cho bên thứ ba không?",
      answer: "Không. Chúng tôi không bán, chia sẻ hay trao đổi dữ liệu cá nhân của bạn với bất kỳ bên thứ ba nào, trừ khi có yêu cầu hợp pháp từ cơ quan chức năng.",
    },
    {
      id: 3,
      question: "Kết quả luận giải nhân tướng có chính xác tuyệt đối không?",
      answer: "Kết quả phân tích dựa trên các nguyên lý truyền thống kết hợp công nghệ AI hiện đại, đạt độ chính xác cao. Tuy nhiên, nhân tướng học chỉ là công cụ tham khảo, không thể quyết định tuyệt đối số phận.",
    },
    {
      id: 4,
      question: "Dịch vụ này có phù hợp với trẻ em không?",
      answer: "Dịch vụ phù hợp với mọi lứa tuổi. Đối với trẻ em dưới 16 tuổi, cần có sự đồng ý và giám sát của phụ huynh khi sử dụng dịch vụ.",
    },
    {
      id: 5,
      question: "Tôi có được hoàn tiền nếu kết quả không như mong đợi?",
      answer: "Chúng tôi cam kết cung cấp kết quả phân tích chính xác và chi tiết. Nếu có vấn đề về chất lượng dịch vụ, vui lòng liên hệ bộ phận hỗ trợ trong vòng 7 ngày để được xem xét.",
    },
    {
      id: 6,
      question: "Tôi có thể sử dụng kết quả phân tích cho mục đích thương mại không?",
      answer: "Kết quả phân tích chỉ dành cho mục đích cá nhân. Việc sử dụng cho mục đích thương mại cần có sự cho phép bằng văn bản từ nhantuong.vn.",
    },
  ];

  const toggleQuestion = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <div className="bg-red-950/90 py-10 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-light text-center text-white mb-12">
            Câu hỏi thường gặp
          </h2>

          {/* FAQ List */}
          <div className="space-y-1">
            {faqData.map((faq, index) => (
              <div key={faq.id} className="border-b border-yellow-600/20">
                {/* Question Header */}
                <div
                  onClick={() => toggleQuestion(faq.id)}
                  className="flex items-center justify-between py-5 cursor-pointer group"
                >
                  <div className="flex-1 text-yellow-100/90 group-hover:text-yellow-300 transition-colors text-sm md:text-base">
                    {String(index + 1).padStart(2, "0")} - {faq.question}
                  </div>

                  {/* Toggle Icon */}
                  <div className="ml-4 shrink-0">
                    {activeQuestion === faq.id ? (
                      <img src={Minus} alt="Collapse" className="w-10 h-10" />
                    ) : (
                      <img src={AddCircle} alt="Expand" className="w-10 h-10" />
                    )}
                  </div>
                </div>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeQuestion === faq.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-5 pr-12">
                    <div className="text-yellow-100/80 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
