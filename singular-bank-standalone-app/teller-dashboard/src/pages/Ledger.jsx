import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/tellerApi";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaSignOutAlt } from "react-icons/fa";

export default function Ledger() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = () => {
    getUsers().then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(userId);
    loadUsers();
  };

  return (
    <div className="p-10 bg-[#f3f1f8] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ledger</h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/add-user")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow"
          >
            <FaPlus /> Add User
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="pb-3">ID</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Phone</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.user_id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/users/${u.user_id}/dashboard`)}

              >
                <td className="py-4">{u.user_id}</td>
                <td className="py-4">{u.name}</td>
                <td className="py-4">{u.phone}</td>

                {/* Delete Button */}
                <td className="py-4 text-right">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(u.user_id);
                    }}
                  >
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
