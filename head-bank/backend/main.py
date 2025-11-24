# head-bank-backend/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import Base, engine, get_db
from . import models, schemas, crud

# Create SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Head Bank Service", version="1.0.0")

# CORS – allow your teammate's frontend origin (change later as needed)
origins = [
    "http://localhost:3000",  # React dev
    "http://localhost:4200",  # Angular dev
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


@app.post("/banks", response_model=schemas.BankRead, status_code=status.HTTP_201_CREATED, tags=["banks"])
def create_bank(bank: schemas.BankCreate, db: Session = Depends(get_db)):
    """
    Register a new bank node in the Head Bank.
    (we're *only* registering metadata in SQLite; starting containers can be added later)
    """
    existing = crud.get_bank_by_bank_id(db, bank.bank_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bank with bank_id '{bank.bank_id}' already exists.",
        )
    db_bank = crud.create_bank(db, bank)
    return db_bank


@app.get("/banks", response_model=List[schemas.BankRead], tags=["banks"])
def list_banks(db: Session = Depends(get_db)):
    """
    List all registered banks.
    """
    banks = crud.get_banks(db)
    return banks


@app.get("/banks/{bank_id}", response_model=schemas.BankRead, tags=["banks"])
def get_bank(bank_id: str, db: Session = Depends(get_db)):
    """
    Get a specific bank by its bank_id.
    """
    bank = crud.get_bank_by_bank_id(db, bank_id)
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bank '{bank_id}' not found.",
        )
    return bank


@app.delete("/banks/{bank_id}", response_model=schemas.BankRead, tags=["banks"])
def delete_bank(bank_id: str, db: Session = Depends(get_db)):
    """
    Soft-delete a bank by setting status='deleted'.
    """
    bank = crud.soft_delete_bank(db, bank_id)
    if not bank:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Bank '{bank_id}' not found.",
        )
    return bank
