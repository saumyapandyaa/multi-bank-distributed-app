// src/pages/Deposit.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserAccounts, deposit } from "../api/tellerApi";

export default function Deposit() {
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

  const handleDeposit = async () => {
    const selectedAccount = accounts.find(
      (a) => a.account_type === accountType
    );
  
    if (!selectedAccount) {
      alert("Account not found.");
      return;
    }
  
    try {
      await deposit(selectedAccount.account_number, Number(amount));
      alert("Deposit successful!");
      navigate(`/users/${userId}/dashboard`);  // ← correct route
    } catch (error) {
      console.error(error);
      alert("Deposit failed.");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f1f8]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-2xl font-bold mb-4">
          Deposit – User {userId}
        </h1>

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

        <div className="mb-4">
          <label className="block text-sm mb-1">Amount</label>
          <input
            className="w-full border rounded p-2"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <button
            className="text-gray-600"
            onClick={() => navigate(`/users/${userId}/dashboard`)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleDeposit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
