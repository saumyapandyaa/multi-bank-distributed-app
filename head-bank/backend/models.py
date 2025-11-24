# head-bank-backend/models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from .database import Base

class Bank(Base):
    __tablename__ = "banks"

    id = Column(Integer, primary_key=True, index=True)
    bank_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=True)
    base_url = Column(String(200), nullable=True)      # e.g. http://localhost:8000
    status = Column(String(20), default="active")      # active / inactive / deleted
    created_at = Column(DateTime(timezone=True), server_default=func.now())
