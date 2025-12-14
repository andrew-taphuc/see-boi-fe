import Header from "../../components/nhantuong/Header";
import Navigation from "../../components/nhantuong/Navigation";
import HeroSection from "../../components/nhantuong/HeroSection";
import FaceAnalysisForm from "../../components/nhantuong/FaceAnalysisForm";
import Features from "../../components/nhantuong/Features";
import FAQ from "../../components/nhantuong/FAQ";
import Footer from "../../components/nhantuong/Footer";
import ImageBackground from "../../assets/nhantuong/bg.jpg";
import ImageBackground2 from "../../assets/nhantuong/pattern7.png";

const NhanTuong = () => {
  return (
    <div className="min-h-screen bg-[#500001] relative overflow-hidden">
      <div className="relative z-10">
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Header />
          <Navigation />
          <HeroSection />
        </div>
        <FaceAnalysisForm />
        <Features />
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(45, 10, 10, 0.5), rgba(45, 10, 10, 0.7)), url(${ImageBackground2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <FAQ />
          <Footer />
        </div>
        {/* <FAQ />
        <Footer /> */}
      </div>
    </div>
  );
};

export default NhanTuong;
