# app/kafka_producer.py
import os
import json
from kafka import KafkaProducer

KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
TOPIC = "cross-bank-transfers"

_producer = None


def get_producer() -> KafkaProducer:
    """
    Lazily create a KafkaProducer the first time we need it.
    Avoids crashing the app at import time if Kafka isn't ready yet.
    """
    global _producer
    if _producer is None:
        _producer = KafkaProducer(
            bootstrap_servers=KAFKA_BOOTSTRAP,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            key_serializer=lambda k: k.encode("utf-8"),
        )
    return _producer


def publish_event(key: str, value: dict) -> None:
    """
    Publish a cross-bank transfer event.

    key = partitioning key (e.g., tx_id)
    value = event payload (dict)
    """
    producer = get_producer()
    producer.send(TOPIC, key=key, value=value)
    producer.flush()
