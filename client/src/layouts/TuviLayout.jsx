import React from "react";
import Navbar from "@components/TuviPage/TuviNavbar";
import TuviFooter from "@components/TuviPage/TuviFooter";
import bgImage from "@assets/tuvi-bg.jpg";

const TuviLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative">
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
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">{children}</main>

        <TuviFooter />
      </div>
    </div>
  );
};

export default TuviLayout;
