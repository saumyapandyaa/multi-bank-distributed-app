import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { externalTransfer } from "../api/tellerApi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function ExternalTransfer() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [bankId, setBankId] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    if (!fromAcc || !toAcc || !bankId || !amount) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await externalTransfer(fromAcc, toAcc, bankId, amount);

      alert("External transfer successful!");
      navigate(`/users/${userId}/dashboard`);
    } catch (err) {
      console.error(err);
      alert("External transfer failed.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-16">
      <div className="absolute inset-x-0 top-8 mx-auto h-72 max-w-3xl rounded-3xl bg-glass-gradient blur-3xl" />
      <div className="relative mx-auto w-full max-w-2xl">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-3xl">External transfer</CardTitle>
            <p className="text-sm text-muted-foreground">
              Send funds to another bank for user #{userId}.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* From Account */}
            <div className="space-y-2">
              <Label htmlFor="from-account">From account</Label>
              <Input
                id="from-account"
                placeholder="Source account number"
                value={fromAcc}
                onChange={(e) => setFromAcc(e.target.value)}
              />
            </div>

            {/* To Account */}
            <div className="space-y-2">
              <Label htmlFor="to-account">Recipient account</Label>
              <Input
                id="to-account"
                placeholder="Recipient account number (other bank)"
                value={toAcc}
                onChange={(e) => setToAcc(e.target.value)}
              />
            </div>

            {/* Destination Bank */}
            <div className="space-y-2">
              <Label htmlFor="bank-id">Destination bank ID</Label>
              <Input
                id="bank-id"
                placeholder="BANK1, BANK2, BANK3..."
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="ext-amount">Amount</Label>
              <Input
                id="ext-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                variant="ghost"
                className="flex-1 text-muted-foreground"
                onClick={() => navigate(`/users/${userId}/transfer`)}
              >
                Cancel
              </Button>

              <Button className="flex-1" onClick={handleTransfer}>
                Confirm transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}