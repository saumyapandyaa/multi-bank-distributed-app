# app/kafka_consumer.py
import os
import json
import threading
from kafka import KafkaConsumer

from app.db import SessionLocal
from app import models

BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
TOPIC = "external_transfers"


def _process_event(event: dict, bank_id: str) -> None:
    """
    Apply an external transfer event IF it's meant for this bank.
    Event format:
      {
        "tx_id": "...",
        "from_bank": "BANK1",
        "destination_bank": "BANK2",
        "to_account": "ACC123",
        "amount": 50.0
      }
    """
    if event.get("destination_bank") != bank_id:
        return  # not for us

    db = SessionLocal()
    try:
        # 1) Find destination account in THIS bank
        dest_acc = (
            db.query(models.Account)
            .filter(models.Account.account_number == event["to_account"])
            .first()
        )

        if not dest_acc:
            # In a real system you'd DLQ or log this; for now just print
            print(
                f"[{bank_id}] Destination account not found: {event['to_account']}"
            )
            return

        # 2) Credit destination account
        dest_acc.balance += float(event["amount"])

        # 3) Log "received" transaction
        tx = models.Transaction(
            tx_id=event["tx_id"],
            tx_type="external_transfer_received",
            amount=float(event["amount"]),
            origin_bank=event["from_bank"],
            destination_bank=bank_id,
            account_id=dest_acc.id,
        )

        db.add(tx)
        db.commit()

        print(
            f"[{bank_id}] Applied external transfer {event['tx_id']} to account {event['to_account']}"
        )

    finally:
        db.close()


def start_consumer(bank_id: str) -> None:
    """
    Blocking loop: listen to external_transfers topic and
    apply any event whose destination_bank == bank_id.
    This is started in a background thread from app.main.
    """
    print(f"[{bank_id}] Starting Kafka consumer on {BOOTSTRAP_SERVERS}…")

    consumer = KafkaConsumer(
        TOPIC,
        bootstrap_servers=BOOTSTRAP_SERVERS.split(","),
        group_id=f"bank-{bank_id}",
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    )

    for msg in consumer:
        try:
            event = msg.value
            _process_event(event, bank_id)
        except Exception as e:
            print(f"[{bank_id}] Error processing Kafka event: {e}")
