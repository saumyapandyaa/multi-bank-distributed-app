// src/pages/Withdraw.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserAccounts, withdraw } from "../api/tellerApi";

export default function Withdraw() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState("checking");
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

  const handleWithdraw = async () => {
    const selectedAccount = accounts.find(
      (a) => a.account_type === accountType
    );

    if (!selectedAccount) {
      alert("Account not found.");
      return;
    }

    try {
      await withdraw(selectedAccount.account_number, Number(amount));
      alert("Withdrawal successful!");
      navigate(`/users/${userId}/dashboard`);
    } catch (error) {
      console.error(error);
      alert("Error processing withdrawal.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f1f8]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-2xl font-bold mb-4">
          Withdraw – User {userId}
        </h1>

        {/* Account Type */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Account Type</label>
          <select
            className="w-full border rounded p-2"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
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
            onClick={() => navigate(`/users/${userId}/dashboard`)}
          >
            Cancel
          </button>

          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleWithdraw}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
