import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserAccounts } from "../api/tellerApi";
import apiClient from "../api/apiClient";

export default function InternalTransfer() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [fromType, setFromType] = useState("checking");
  const [toType, setToType] = useState("savings");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await getUserAccounts(userId);
        setAccounts(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [userId]);

  const handleTransfer = async () => {
    if (fromType === toType) {
      alert("Cannot transfer to the same account type.");
      return;
    }

    try {
      // ✔ FIXED ENDPOINT
      await apiClient.post("/transactions/transfer-internal", {
        user_id: userId,
        from_account_type: fromType,
        to_account_type: toType,
        amount: Number(amount),
      });

      alert("Internal transfer successful!");
      navigate(`/users/${userId}/dashboard`);
    } catch (err) {
      console.error(err);
      alert("Internal transfer failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f1f8]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-2xl font-bold mb-4">
          Internal Transfer – User {userId}
        </h1>

        {/* FROM ACCOUNT */}
        <div className="mb-4">
          <label className="block text-sm mb-1">From Account</label>
          <select
            className="w-full border rounded p-2"
            value={fromType}
            onChange={(e) => {
              setFromType(e.target.value);
              setToType(e.target.value === "checking" ? "savings" : "checking");
            }}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>

        {/* TO ACCOUNT */}
        <div className="mb-4">
          <label className="block text-sm mb-1">To Account</label>
          <select
            className="w-full border rounded p-2"
            value={toType}
            onChange={(e) => setToType(e.target.value)}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>

        {/* AMOUNT */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Amount</label>
          <input
            className="w-full border rounded p-2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between">
          <button
            className="text-gray-600"
            onClick={() => navigate(`/users/${userId}/transfer`)}
          >
            Cancel
          </button>

          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleTransfer}
          >
            Confirm Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
