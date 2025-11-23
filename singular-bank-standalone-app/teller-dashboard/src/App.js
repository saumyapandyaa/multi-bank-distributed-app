import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Ledger from "./pages/Ledger";
import TellerDashboard from "./pages/TellerDashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import SameBranchTransfer from "./pages/SameBranchTransfer";


// New pages
import TransferType from "./pages/TransferType";
import InternalTransfer from "./pages/InternalTransfer";
// Optional placeholders if you want to add later:
// import SameBranchTransfer from "./pages/SameBranchTransfer";
// import ExternalTransfer from "./pages/ExternalTransfer";

import AddUser from "./pages/AddUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* LEDGER */}
        <Route path="/ledger" element={<Ledger />} />

        {/* ADD USER */}
        <Route path="/add-user" element={<AddUser />} />

        {/* DASHBOARD */}
        <Route
          path="/users/:userId/dashboard"
          element={<TellerDashboard />}
        />

        {/* TRANSACTION PAGES */}
        <Route path="/users/:userId/deposit" element={<Deposit />} />
        <Route path="/users/:userId/withdraw" element={<Withdraw />} />

        {/* TRANSFER */}
        <Route path="/users/:userId/transfer" element={<TransferType />} />

        {/* INTERNAL ACCOUNT TRANSFER */}
        <Route
          path="/users/:userId/transfer/internal"
          element={<InternalTransfer />}
        />

        <Route
          path="/users/:userId/transfer/same-branch"
          element={<SameBranchTransfer />}
        />
        {/* Uncomment once created */}
        {/*
        <Route
          path="/users/:userId/transfer/same-branch"
          element={<SameBranchTransfer />}
        />
        <Route
          path="/users/:userId/transfer/external"
          element={<ExternalTransfer />}
        />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
