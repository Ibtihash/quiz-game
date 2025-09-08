// src/components/AuthHeader.jsx
import React from "react";
import { Link } from "react-router-dom";

const AuthHeader = () => {
  return (
    <header className="bg-green-500 py-4 shadow-md">
      <div className="flex justify-center items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-white text-green-500 font-bold rounded-lg w-10 h-10 flex items-center justify-center">
            Q
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">QuizMaster</h1>
            <p className="text-sm">Test your knowledge</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default AuthHeader;
