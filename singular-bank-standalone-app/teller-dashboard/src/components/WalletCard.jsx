import React from "react";

export default function WalletCard({ name, number, expiry, bg = "from-gray-900 to-gray-700" }) {
  return (
    <div className={`w-72 h-40 rounded-2xl p-5 text-white bg-gradient-to-br ${bg} shadow-xl`}>
      <div className="text-lg font-bold">VISA</div>

      <div className="mt-5 text-xl font-semibold tracking-wide">
        {name}
      </div>

      <div className="mt-2 tracking-widest text-sm">
        •••• •••• •••• {number.slice(-4)}
      </div>

      <div className="mt-4 text-xs">
        EXP: {expiry}
      </div>
    </div>
  );
}
