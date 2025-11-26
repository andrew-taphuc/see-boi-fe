import React, { useContext } from "react";

const LoginRegisterButton = ({ ButtonName }) => {
  return (
    <button className="text-xl w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition duration-200">
      {ButtonName}
    </button>
  );
};

export default LoginRegisterButton;
