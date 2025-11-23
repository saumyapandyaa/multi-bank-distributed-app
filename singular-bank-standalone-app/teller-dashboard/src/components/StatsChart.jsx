// src/components/StatsChart.jsx
import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Format for X-axis (e.g., "Nov 21")
function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Custom tooltip UI
function StatsTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  const dep = payload.find((p) => p.dataKey === "deposits");
  const wd = payload.find((p) => p.dataKey === "withdrawals");
  const bal = payload.find((p) => p.dataKey === "balance");

  return (
    <div className="bg-white shadow-lg rounded-lg px-3 py-2 text-xs">
      <div className="font-semibold mb-1">{label}</div>

      {dep && dep.value !== 0 && (
        <div>
          <span className="text-gray-500 mr-1">Deposits:</span>
          <span className="text-green-600 font-medium">+{dep.value}</span>
        </div>
      )}

      {wd && wd.value !== 0 && (
        <div>
          <span className="text-gray-500 mr-1">Withdrawals:</span>
          <span className="text-red-500 font-medium">-{wd.value}</span>
        </div>
      )}

      {bal && (
        <div>
          <span className="text-gray-500 mr-1">Balance:</span>
          <span className="font-semibold">${bal.value}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Multi-metric bar chart:
 * - Blue bar: running balance (real, based on backend currentBalance)
 * - Green bar: deposits per day
 * - Red bar: withdrawals per day
 *
 * We compute daily deposits/withdrawals, then walk BACKWARDS from
 * currentBalance so that the last point always equals the true balance.
 */
export default function StatsChart({ transactions, currentBalance }) {
  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // 1) Group per day: deposits / withdrawals / net change
    const perDay = new Map();

    transactions.forEach((tx) => {
      const dateKey = (tx.timestamp || "").slice(0, 10); // "YYYY-MM-DD"
      const amt = Number(tx.amount || 0);
      const type = (tx.tx_type || tx.type || "").toLowerCase();

      const isDeposit =
        type.includes("deposit") || type.includes("internal_account_transfer");
      const isWithdraw = type.includes("withdraw");

      if (!perDay.has(dateKey)) {
        perDay.set(dateKey, { deposits: 0, withdrawals: 0, net: 0 });
      }

      const block = perDay.get(dateKey);

      if (isDeposit) {
        block.deposits += amt;
        block.net += amt;
      }
      if (isWithdraw) {
        block.withdrawals += amt;
        block.net -= amt;
      }
    });

    // 2) Sort dates oldest → newest
    const sortedDates = Array.from(perDay.keys()).sort();

    // 3) Start from REAL backend balance
    let running = Number(currentBalance || 0);

    const reversed = [];

    // Walk backwards to unwind net changes
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const dateKey = sortedDates[i];
      const { deposits, withdrawals, net } = perDay.get(dateKey);

      reversed.push({
        date: formatDateLabel(dateKey),
        deposits,
        withdrawals,
        balance: running,
      });

      running -= net; // undo this day's net change
    }

    // 4) Flip back to oldest → newest for chart
    return reversed.reverse();
  }, [transactions, currentBalance]);

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Not enough activity yet
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 16, right: 24, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />

          <XAxis dataKey="date" tick={{ fontSize: 11 }} />

          {/* Single axis is enough here because all units are $ */}
          <YAxis tick={{ fontSize: 11 }} axisLine={false} />

          <Tooltip content={<StatsTooltip />} />
          <Legend />

          {/* Balance bar */}
          <Bar
            dataKey="balance"
            name="balance"
            fill="#2563EB"
            barSize={18}
            radius={[4, 4, 0, 0]}
          />

          {/* Deposits */}
          <Bar
            dataKey="deposits"
            name="deposits"
            fill="#16A34A"
            barSize={18}
            radius={[4, 4, 0, 0]}
          />

          {/* Withdrawals */}
          <Bar
            dataKey="withdrawals"
            name="withdrawals"
            fill="#DC2626"
            barSize={18}
            radius={[4, 4, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
