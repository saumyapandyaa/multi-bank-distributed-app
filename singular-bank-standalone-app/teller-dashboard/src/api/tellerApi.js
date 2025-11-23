// src/api/tellerApi.js
import apiClient from "./apiClient";

/* ------------------------
   AUTH
-------------------------*/

// NEW ADMIN LOGIN (correct backend format)
export const adminLogin = (adminId, password) =>
  apiClient.post("/auth/login", {
    admin_id: adminId,
    password: password,
  });

/* ------------------------
   USER MANAGEMENT
-------------------------*/

export const getUsers = () => apiClient.get("/users/");
export const createUser = (data) => apiClient.post("/users/create", data);

export const deleteUser = (userId) =>
  apiClient.delete(`/users/${userId}`);

/* ------------------------
   ACCOUNTS & HISTORY
-------------------------*/

export const getUserAccounts = (userId) =>
  apiClient.get(`/accounts/${userId}`);

export const getHistory = (accountNumber) =>
  apiClient.get(`/transactions/history/${accountNumber}`);

/* ------------------------
   TRANSACTIONS
-------------------------*/

export async function deposit(account_number, amount) {
  return apiClient.post("/transactions/deposit", {
    account_number,
    amount: Number(amount),
  });
}

export const withdraw = (accountNumber, amount) =>
  apiClient.post("/transactions/withdraw", {
    account_number: accountNumber,
    amount: Number(amount),
  });

export const sameBranchTransfer = (fromAcc, toAcc, amount) =>
  apiClient.post("/transactions/transfer-same-branch", {
    from_account: fromAcc,
    to_account: toAcc,
    amount: Number(amount),
  });

/* ------------------------
   CARDS
-------------------------*/

export const getCards = (userId) =>
  apiClient.get(`/cards/${userId}`);

export const createCard = (userId, cardType) =>
  apiClient.post(`/cards/create?user_id=${userId}&card_type=${cardType}`);

export const deleteCard = (cardNumber) =>
  apiClient.delete(`/cards/delete/${encodeURIComponent(cardNumber)}`);
