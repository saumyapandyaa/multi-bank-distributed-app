from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import schemas  # 👈 re-use your existing BankRead schema for response_model

app = FastAPI(title="Head Bank Service", version="1.0.0")

origins = [
    "http://localhost:3000",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok"}


# 👇 Hardcoded list of banks – ONLY bank1 and bank2 exist
BANKS = [
    {
        "bank_id": "bank1",
        "name": "Bank 1",
        "base_url": "http://localhost:8001",  # backend for bank1
        "is_active": True,
    },
    {
        "bank_id": "bank2",
        "name": "Bank 2",
        "base_url": "http://localhost:8002",  # backend for bank2
        "is_active": True,
    },
]


@app.get("/banks", response_model=List[schemas.BankRead], tags=["banks"])
def list_banks():
    """
    Return the fixed list of banks (bank1 and bank2).
    """
    return BANKS


@app.get("/banks/{bank_id}", response_model=schemas.BankRead, tags=["banks"])
def get_bank(bank_id: str):
    """
    Return a single bank by its bank_id (bank1 or bank2).
    """
    for bank in BANKS:
        if bank["bank_id"] == bank_id:
            return bank

    raise HTTPException(
        status_code=404,
        detail=f"Bank '{bank_id}' not found.",
    )
