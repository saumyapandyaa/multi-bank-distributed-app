import React from "react";

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="bg-white shadow p-6 rounded-lg w-full h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-4">Transactions</h3>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((tx, i) => (
            <tr key={i} className="border-b">
              <td className="p-2">{tx.type}</td>
              <td className="p-2 text-gray-600">{tx.description}</td>
              <td className={`p-2 font-semibold ${
                  tx.amount < 0 ? "text-red-500" : "text-green-600"
                }`}
              >
                {tx.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
