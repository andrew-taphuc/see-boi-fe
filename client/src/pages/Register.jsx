import React from "react";
import { Link } from "react-router-dom";
import LoginRegisterButton from "../components/Login&RegisterButton";

const Register = () => {
  return (
    <div>
      <div className="justify-center items-center flex h-screen bg-gradient-to-br from-yellow-300 to-purple-700">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-center">REGISTER</h2>
          <form action="">
            <div className="mb-3">
              <label className=" block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className=" w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="abc@email.com"
              />
            </div>

            <div className="mb-3">
              <label className=" block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className=" w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Password"
              />
            </div>

            <div>
              <label className=" block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                className=" w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm Password"
              />
            </div>

            <div className="flex justify-end items-center mt-1 mb-5 text-sm">
              <div>
                <span className="text-gray-600">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-blue-500 hover:underline font-semibold"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <LoginRegisterButton ButtonName="Register" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
