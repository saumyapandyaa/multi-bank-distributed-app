import React from "react";
import { Link } from "react-router-dom";
import { FaMoneyCheckAlt, FaExchangeAlt, FaBook, FaUserPlus } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#f3f1f8] h-screen p-6 flex flex-col border-r">

      <h1 className="text-2xl font-bold mb-10">Test</h1>

      <nav className="flex flex-col gap-6 text-gray-700">

        <Link to="/deposit" className="flex items-center gap-3 hover:text-blue-600">
          <FaMoneyCheckAlt /> Deposit
        </Link>

        <Link to="/withdraw" className="flex items-center gap-3 hover:text-blue-600">
          <FaMoneyCheckAlt /> Withdraw
        </Link>

        <Link to="/transfer" className="flex items-center gap-3 hover:text-blue-600">
          <FaExchangeAlt /> Transfer
        </Link>

        <Link to="/ledger" className="flex items-center gap-3 hover:text-blue-600">
          <FaBook /> Ledger
        </Link>

        <Link to="/account-create" className="flex items-center gap-3 hover:text-blue-600">
          <FaUserPlus /> Account Creation
        </Link>
      </nav>

      <div className="mt-auto">
        <button className="flex items-center gap-3 text-red-500 hover:text-red-600">
          <RiLogoutBoxRLine /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
