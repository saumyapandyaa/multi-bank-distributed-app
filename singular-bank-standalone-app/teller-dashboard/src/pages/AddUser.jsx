import { useState } from "react";
import { createUser } from "../api/tellerApi";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const user = { name, phone };
      await createUser(user);
      alert("User created!");
      navigate("/ledger");
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  return (
    <div className="p-10 min-h-screen bg-[#f3f1f8] flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow max-w-md w-full">

        <h1 className="text-2xl font-bold mb-6">Create New User</h1>

        <div className="space-y-4">

          <input
            className="border p-2 w-full rounded"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Create User
          </button>

          <button
            onClick={() => navigate("/ledger")}
            className="text-gray-600 underline w-full mt-2"
          >
            ← Back to Ledger
          </button>

        </div>
      </div>
    </div>
  );
}
