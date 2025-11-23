// src/pages/Login.jsx
import React, { useState } from "react";
import { adminLogin } from "../api/tellerApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await adminLogin(adminId, password);

      // Backend returns: { access_token: "...", token_type: "bearer" }
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("admin_id", adminId);

      alert("Login successful!");
      navigate("/ledger");

    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid Admin ID or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f1f8]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>

        {/* ADMIN ID */}
        <input
          type="text"
          className="border p-2 rounded mb-4 w-full"
          placeholder="Admin ID (e.g., ADMIN1)"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="border p-2 rounded mb-4 w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          className="bg-blue-600 text-white p-2 rounded w-full"
          onClick={handleLogin}
        >
          Login
        </button>

        <button className="underline text-sm text-gray-500 mt-4">
          Switch to Branch Manager →
        </button>
      </div>
    </div>
  );
}
