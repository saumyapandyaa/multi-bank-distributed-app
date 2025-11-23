// src/pages/TellerDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUserAccounts,
  getHistory,
  getCards,
  createCard,
  deleteCard,
} from "../api/tellerApi";
import StatsChart from "../components/StatsChart";

export default function TellerDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [selectedType, setSelectedType] = useState("checking");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [isCardLoading, setIsCardLoading] = useState(false);

  /* ------------------------------------------
   * Load accounts
   * ----------------------------------------- */
  useEffect(() => {
    async function loadAccounts() {
      try {
        const res = await getUserAccounts(userId);
        const data = res.data || [];
        setAccounts(data);

        const checking = data.find((a) => a.account_type === "checking");
        const savings = data.find((a) => a.account_type === "savings");

        const acc = checking || savings;
        if (acc) {
          setSelectedType(acc.account_type);
          setCurrentAccount(acc);
          loadHistory(acc.account_number);
        }
      } catch (err) {
        console.error("Failed to load accounts:", err);
      }
    }
    loadAccounts();
  }, [userId]);

  /* ------------------------------------------
   * Load history
   * ----------------------------------------- */
  async function loadHistory(accNo) {
    try {
      const res = await getHistory(accNo);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }

  useEffect(() => {
    if (!accounts.length) return;
    const acc = accounts.find((a) => a.account_type === selectedType);
    if (acc) {
      setCurrentAccount(acc);
      loadHistory(acc.account_number);
    }
  }, [selectedType, accounts]);

  /* ------------------------------------------
   * Load cards
   * ----------------------------------------- */
  async function loadCards() {
    try {
      setIsCardLoading(true);
      const res = await getCards(userId);
      const list = res.data || [];
      setCards(list);

      // Debit card always default
      const defaultCard =
        list.find((c) => c.card_type === "debit") || list[0] || null;

      setSelectedCardId(defaultCard?.id || null);
    } catch (err) {
      console.error("Failed to load cards:", err);
    } finally {
      setIsCardLoading(false);
    }
  }

  useEffect(() => {
    loadCards();
  }, [userId]);

  /* ------------------------------------------
   * Add card
   * ----------------------------------------- */
  async function handleAddCard(type) {
    try {
      setIsCardLoading(true);
      await createCard(userId, type);
      await loadCards();
    } catch {
      alert("Error creating card.");
    } finally {
      setIsCardLoading(false);
    }
  }

  /* ------------------------------------------
   * Delete non-debit card
   * ----------------------------------------- */
  async function handleDeleteSelectedCard(card) {
    if (!card) return;

    if (card.card_type === "debit") {
      alert("Cannot delete default debit card.");
      return;
    }

    if (!window.confirm(`Delete card ending ${card.card_number.slice(-4)}?`))
      return;

    try {
      setIsCardLoading(true);
      await deleteCard(card.card_number);
      await loadCards();
    } catch {
      alert("Error deleting card.");
    } finally {
      setIsCardLoading(false);
    }
  }

  /* ------------------------------------------
   * Card ordering
   * ----------------------------------------- */
  const orderedCards = useMemo(() => {
    if (!cards.length) return [];
    const front = cards.find((c) => c.id === selectedCardId);
    const rest = cards.filter((c) => c.id !== selectedCardId);
    return front ? [front, ...rest] : cards;
  }, [cards, selectedCardId]);

  const selectedCard = orderedCards[0] || null;

  /* ------------------------------------------
   * Card helpers
   * ----------------------------------------- */
  function cardBg(type) {
    switch ((type || "").toLowerCase()) {
      case "debit":
        return "bg-[#0B1120]";
      case "credit":
        return "bg-[#1D4ED8]";
      case "prepaid":
        return "bg-[#15803D]";
      default:
        return "bg-slate-700";
    }
  }

  function cardLabel(type) {
    switch ((type || "").toLowerCase()) {
      case "debit":
        return "DEBIT CARD";
      case "credit":
        return "CREDIT CARD";
      case "prepaid":
        return "PREPAID CARD";
      default:
        return "CARD";
    }
  }

  /* ------------------------------------------
   * Wallet UI (3-card stack, fully visible)
   * ----------------------------------------- */
  const renderWallet = () => (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Wallet</h2>

        <div className="flex gap-3">
          <button
            onClick={() => handleAddCard("credit")}
            className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
          >
            + Credit
          </button>
          <button
            onClick={() => handleAddCard("prepaid")}
            className="px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100"
          >
            + Prepaid
          </button>
        </div>
      </div>

      {/* H = large enough for 3 stacked cards */}
      <div className="relative h-[360px] w-[360px]">

        {/* BACK CARDS */}
        {orderedCards.slice(1).map((card, i) => (
          <div
            key={card.id}
            className={`absolute w-[310px] h-[180px] rounded-3xl ${cardBg(
              card.card_type
            )} text-white shadow-xl cursor-pointer`}
            style={{
              top: 50 + i * 35,
              left: 35 + i * 25,
              zIndex: 10 - i,
              opacity: 0.75,
            }}
            onClick={() => setSelectedCardId(card.id)}
          >
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs">{cardLabel(card.card_type)}</div>
                <div className="text-sm mt-1">VISA</div>
              </div>
              <div className="text-xs">EXP {card.expiry}</div>
            </div>
          </div>
        ))}

        {/* FRONT CARD */}
        {selectedCard && (
          <div
            className={`absolute w-[330px] h-[200px] rounded-3xl ${cardBg(
              selectedCard.card_type
            )} text-white shadow-2xl cursor-pointer z-[99]`}
            style={{ top: 0, left: 0 }}
            onClick={() => setSelectedCardId(selectedCard.id)}
          >
            <div className="p-6 flex flex-col justify-between h-full">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs">{cardLabel(selectedCard.card_type)}</div>
                  <div className="text-sm">VISA</div>
                </div>

                {selectedCard.card_type === "debit" && (
                  <span className="px-3 py-1 rounded-full bg-slate-700/70 border border-slate-500 text-[11px]">
                    Default
                  </span>
                )}
              </div>

              <div className="tracking-[0.25em] text-lg mt-2">
                {selectedCard.card_number}
              </div>

              <div className="flex justify-between text-xs mt-2">
                <div>
                  <p className="text-gray-300">EXP</p>
                  <p>{selectedCard.expiry}</p>
                </div>
                <div>
                  <p className="text-gray-300">CVV</p>
                  <p>{selectedCard.cvv}</p>
                </div>
              </div>

              {selectedCard.card_type !== "debit" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSelectedCard(selectedCard);
                  }}
                  className="mt-3 px-4 py-1 border border-red-500 text-red-500 rounded-full text-xs hover:bg-red-50"
                >
                  Delete card
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ------------------------------------------
   * MAIN LAYOUT
   * ----------------------------------------- */
  return (
    <div className="min-h-screen flex bg-[#f3f1f8]">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white h-screen p-6 flex flex-col border-r">
        <h2 className="text-xl font-bold mb-8">User: {userId}</h2>

        <nav className="flex flex-col gap-5 text-gray-700">
          <button onClick={() => navigate(`/users/${userId}/deposit`)}>Deposit</button>
          <button onClick={() => navigate(`/users/${userId}/withdraw`)}>Withdraw</button>
          <button onClick={() => navigate(`/users/${userId}/transfer`)}>Transfer</button>
        </nav>

        <div className="mt-auto text-sm">
          <button onClick={() => navigate("/ledger")}>← Back to Ledger</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>

          <div className="flex gap-2 bg-white rounded-full p-1 shadow">
            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedType === "checking" ? "bg-blue-600 text-white" : "text-gray-600"
              }`}
              onClick={() => setSelectedType("checking")}
            >
              Checking
            </button>

            <button
              className={`px-4 py-2 rounded-full text-sm ${
                selectedType === "savings" ? "bg-blue-600 text-white" : "text-gray-600"
              }`}
              onClick={() => setSelectedType("savings")}
            >
              Savings
            </button>
          </div>
        </div>

        {/* ACCOUNT SUMMARY */}
        {currentAccount && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-1">Total Balance</h2>
            <p className="text-3xl font-bold">${currentAccount.balance}</p>
            <p className="text-gray-400 text-sm">
              Account No: {currentAccount.account_number}
            </p>
          </div>
        )}

<div className="grid grid-cols-3 gap-6 min-h-[50px]">

{/* STATISTICS spans row 1 and 2 */}
<div className="col-span-2 row-span-2 bg-white rounded-xl shadow p-4 flex flex-col">
  <h3 className="font-semibold mb-2">Statistics</h3>
  <div className="flex-1">
    <StatsChart
      transactions={transactions}
      currentBalance={currentAccount?.balance}
    />
  </div>
</div>

{/* TRANSACTIONS stays in row 1 */}
<div className="bg-white rounded-xl shadow p-4 h-[240px] overflow-y-auto col-start-3 row-start-1">
  <h3 className="font-semibold mb-2">Transactions</h3>
  {transactions.map((t, i) => (
    <div
      key={i}
      className="flex justify-between border-b py-1 last:border-b-0 text-sm"
    >
      <span>{t.tx_type}</span>
      <span className={t.amount >= 0 ? "text-green-600" : "text-red-500"}>
        {t.amount >= 0 ? "+" : ""}
        {t.amount}
      </span>
    </div>
  ))}
</div>

{/* WALLET always stays below Transactions */}
<div className="col-start-3 row-start-2">
  {renderWallet()}
</div>

</div>



          
        </div>
    </div>
  );
}
