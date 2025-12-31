import React, { useEffect } from "react";
import ThemedHeader from "@components/common/ThemedHeader";
import bgImage from "@assets/tuvi-bg.jpg";
import CommonFooter from "@components/common/CommonFooter";

const TuviLayout = ({ children }) => {
  // Ngăn overscroll và đặt background để tránh lộ nền trắng
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyOverscroll = document.body.style.overscrollBehavior;
    const originalHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    
    // Đặt màu nền và ngăn overscroll
    document.body.style.backgroundColor = '#292524';
    document.documentElement.style.backgroundColor = '#292524';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overscrollBehavior = 'none';
    
    // Cleanup khi unmount
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.overscrollBehavior = originalBodyOverscroll;
      document.documentElement.style.overscrollBehavior = originalHtmlOverscroll;
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        overscrollBehavior: 'none',
        overscrollBehaviorY: 'none',
        overflowX: 'hidden',
      }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#292524",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Nội dung chính */}
      <div 
        className="relative z-10 w-full flex flex-col min-h-screen"
        style={{
          overscrollBehavior: 'none',
          overscrollBehaviorY: 'none',
        }}
      >
        <ThemedHeader variant="tuvi" />
        <main className="flex-1 pt-20">{children}</main>
        <div className="mt-auto">
          <CommonFooter variant="tuvi" />
        </div>
      </div>
    </div>
  );
};

export default TuviLayout;
