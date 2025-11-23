import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function SameBranchTransfer() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    if (!fromAcc || !toAcc || !amount) {
      alert("Please fill all fields.");
      return;
    }

    try {
      // ✅ FIXED: correct backend endpoint
      await apiClient.post("/transactions/transfer-same-bank", {
        from_account: fromAcc,
        to_account: toAcc,
        amount: Number(amount),
      });

      alert("Same-bank transfer successful!");
      navigate(`/users/${userId}/dashboard`);
    } catch (err) {
      console.error(err);
      alert("Transfer failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f1f8]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-2xl font-bold mb-4">
          Same-Bank Transfer
        </h1>

        {/* From Account */}
        <div className="mb-4">
          <label className="block text-sm mb-1">From Account</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Enter source account number"
            value={fromAcc}
            onChange={(e) => setFromAcc(e.target.value)}
          />
        </div>

        {/* To Account */}
        <div className="mb-4">
          <label className="block text-sm mb-1">To Account</label>
          <input
            className="w-full border rounded p-2"
            placeholder="Enter destination account number"
            value={toAcc}
            onChange={(e) => setToAcc(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Amount</label>
          <input
            className="w-full border rounded p-2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="text-gray-600"
            onClick={() => navigate(`/users/${userId}/transfer`)}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleTransfer}
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
