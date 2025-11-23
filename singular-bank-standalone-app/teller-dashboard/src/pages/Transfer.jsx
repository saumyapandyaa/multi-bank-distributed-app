import { useState } from "react";
import { transfer } from "../api/tellerApi";

export default function Transfer() {
  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    try {
      await transfer(fromAcc, toAcc, Number(amount));
      alert("Transfer successful!");
    } catch (err) {
      console.error(err);
      alert("Error processing transfer");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer</h1>

      <div className="space-y-4">
        <input
          className="border p-2 rounded w-64"
          placeholder="From Account"
          value={fromAcc}
          onChange={e => setFromAcc(e.target.value)}
        />

        <input
          className="border p-2 rounded w-64"
          placeholder="To Account"
          value={toAcc}
          onChange={e => setToAcc(e.target.value)}
        />

        <input
          className="border p-2 rounded w-64"
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <button
          onClick={handleTransfer}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  );
}
