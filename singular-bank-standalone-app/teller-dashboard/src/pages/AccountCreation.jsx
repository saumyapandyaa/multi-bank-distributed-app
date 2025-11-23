import { useState } from "react";
import { createAccount } from "../api/tellerApi";

export default function AccountCreation() {
  const [accNum, setAccNum] = useState("");
  const [initialBalance, setInitialBalance] = useState("");

  const handleCreate = async () => {
    try {
      await createAccount({
        account_number: accNum,
        initial_balance: Number(initialBalance),
      });
      alert("Account Created!");
    } catch (err) {
      console.error(err);
      alert("Error creating account");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <div className="space-y-4">
        <input
          className="border p-2 rounded w-64"
          placeholder="Account Number"
          value={accNum}
          onChange={e => setAccNum(e.target.value)}
        />

        <input
          className="border p-2 rounded w-64"
          placeholder="Initial Balance"
          type="number"
          value={initialBalance}
          onChange={e => setInitialBalance(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
