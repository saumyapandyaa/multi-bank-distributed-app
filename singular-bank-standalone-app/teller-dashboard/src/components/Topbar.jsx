import React from "react";

const Topbar = () => {
  return (
    <div className="bg-[#f3f1f8] h-16 flex items-center justify-between px-6 border-b">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="text-gray-600 font-medium">Teller</div>
    </div>
  );
};

export default Topbar;
