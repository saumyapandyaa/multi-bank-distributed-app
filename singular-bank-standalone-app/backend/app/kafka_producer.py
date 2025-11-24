# app/kafka_producer.py
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


def publish_event(topic: str, key: Optional[str], value: Any) -> None:
    """
    Dummy Kafka publisher: we removed Kafka, so just log the event.
    """
    logger.info(
        "Kafka disabled. Would publish to topic=%s key=%s value=%s",
        topic,
        key,
        value,
    )
