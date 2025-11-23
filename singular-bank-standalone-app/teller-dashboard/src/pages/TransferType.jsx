import { useNavigate, useParams } from "react-router-dom";

export default function TransferType() {
  const navigate = useNavigate();
  const { userId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f1f8]">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-2xl font-bold mb-6">Choose Transfer Type</h1>

        <div className="flex flex-col gap-4">

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
            onClick={() => navigate(`/users/${userId}/transfer/internal`)}
          >
            Internal Transfer (Between User Accounts)
          </button>

          <button
            className="w-full bg-purple-600 text-white py-3 rounded-lg"
            onClick={() => navigate(`/users/${userId}/transfer/same-branch`)}
          >
            Same Branch Transfer
          </button>

          <button
            className="w-full bg-emerald-600 text-white py-3 rounded-lg"
            onClick={() => navigate(`/users/${userId}/transfer/external`)}
          >
            External Transfer
          </button>

          <button
            className="text-gray-600 text-sm mt-4"
            onClick={() => navigate(`/users/${userId}/dashboard`)}
          >
            ← Back to Dashboard
          </button>

        </div>
      </div>
    </div>
  );
}
