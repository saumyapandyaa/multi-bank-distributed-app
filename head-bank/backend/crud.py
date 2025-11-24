# head-bank-backend/crud.py
from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas


def create_bank(db: Session, bank: schemas.BankCreate) -> models.Bank:
    # check if bank_id already exists
    existing = db.query(models.Bank).filter(models.Bank.bank_id == bank.bank_id).first()
    if existing:
        return existing  # or raise error, depending on what you prefer

    db_bank = models.Bank(
        bank_id=bank.bank_id,
        name=bank.name,
        base_url=str(bank.base_url) if bank.base_url else None,
    )
    db.add(db_bank)
    db.commit()
    db.refresh(db_bank)
    return db_bank


def get_banks(db: Session) -> List[models.Bank]:
    return db.query(models.Bank).all()


def get_bank_by_bank_id(db: Session, bank_id: str) -> Optional[models.Bank]:
    return db.query(models.Bank).filter(models.Bank.bank_id == bank_id).first()


def soft_delete_bank(db: Session, bank_id: str) -> Optional[models.Bank]:
    bank = get_bank_by_bank_id(db, bank_id)
    if not bank:
        return None
    bank.status = "deleted"
    db.commit()
    db.refresh(bank)
    return bank
