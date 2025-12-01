import React, { useContext } from "react";

const LoginRegisterButton = ({ ButtonName }) => {
  return (
    <button className="text-xl w-full bg-amber-600 text-white font-semibold py-3 rounded-lg hover:bg-amber-800 transition duration-200 cursor-pointer">
      {ButtonName}
    </button>
  );
};

export default LoginRegisterButton;
