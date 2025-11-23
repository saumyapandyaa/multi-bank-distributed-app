import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow p-6 rounded-lg w-80">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
