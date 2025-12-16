import React from "react";
import Navbar from "../components/TuviPage/TuviNavbar";
import TuViForm from "../components/TuviPage/TuViForm";
import TuViIntro from "../components/TuviPage/TuViIntro";
import bgImage from "../assets/TuViBackground.jpg";
import Footer from "../components/TuviPage/TuviFooter";
import TuviFooter from "../components/TuviPage/TuviFooter";

const TuVi = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#292524", // Màu nâu đậm dự phòng nếu chưa có ảnh
        }}
      >
        {/* Lớp phủ đen mờ để text dễ đọc hơn trên nền ảnh */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Nội dung chính nằm trên nền */}
      <div className="relative z-10 w-full">
        <Navbar />

        {/* Container cho Form, căn giữa và cách top một chút */}
        <div className="flex justify-center items-center py-12 px-4">
          <TuViForm />
        </div>

        <TuViIntro />

        <div>
          <TuviFooter />
        </div>
      </div>
    </div>
  );
};

export default TuVi;
