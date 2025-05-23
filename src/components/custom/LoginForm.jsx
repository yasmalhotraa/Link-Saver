import React, { useState } from "react";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "@/services/auth";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";

function LoginForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      await doSignInWithEmailAndPassword(email, password);
      toast("Logged in successfully!");
      onClose(); //used this to close the form after completing login
    } catch (error) {
      toast(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await doSignInWithGoogle();
      toast("Logged in with Google!");
      onClose();
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#f3eadf] dark:bg-stone-800 p-5 rounded-2xl shadow-md w-96 ">
        <div className="flex gap-1 mb-5 items-center">
          <h2 className="font-extrabold text-2xl text-blue-600">
            <span>Link</span>
            <span>Saver</span>
          </h2>
        </div>
        <h2 className="text-[18px] text-gray-600 dark:text-gray-300 font-bold mb-3 mx-2">
          Please Sign in to the App
        </h2>

        {/* Email*/}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password*/}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Email/Password Login Button */}
        <button
          onClick={handleEmailLogin}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-full mb-4"
        >
          Sign In with Email
        </button>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white py-2 rounded-full"
        >
          <FaGoogle className="text-xl" />{" "}
          <p className="text-center">Sign In with Google</p>
        </button>

        <button
          onClick={onClose}
          className="mt-3 bg-black h-11 w-full text-white border rounded-full hover:bg-gray-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
