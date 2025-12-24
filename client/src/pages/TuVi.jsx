import React from "react";
import TuViForm from "@components/TuviPage/TuViForm";
import TuViIntro from "@components/TuviPage/TuViIntro";

const TuVi = () => {
  return (
    <>
      {/* Container cho Form, căn giữa và cách top một chút */}
      <div className="flex justify-center items-center py-12 px-4">
        <TuViForm />
      </div>

      <TuViIntro />
    </>
  );
};

export default TuVi;
