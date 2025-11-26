import React from "react";
import { Link } from "react-router-dom";
import LoginRegisterButton from "../components/Login&RegisterButton";

const Login = () => {
  return (
    <div>
      <div className="justify-center items-center flex h-screen bg-gradient-to-br from-purple-700 to-yellow-300">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-center">LOGIN</h2>
          <form action="">
            <div className="mb-4">
              <label className="text-xl block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="text-xl w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="abc@email.com"
              />
            </div>

            <div>
              <label className="text-xl block text-gray-700">Password</label>
              <input
                type="password"
                className="text-xl w-full px-4 py-2  border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-between items-center mt-1 mb-5 text-sm">
              <a href="#" className="text-blue-500 hover:underline">
                Forgot Password?
              </a>

              <div>
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-blue-500 hover:underline font-semibold"
                >
                  Register
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <LoginRegisterButton ButtonName="Login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
