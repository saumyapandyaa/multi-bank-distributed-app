# app/kafka_consumer.py
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


def start_consumer(
    topic: Optional[str] = None,
    group_id: Optional[str] = None,
    *args: Any,
    **kwargs: Any,
) -> None:
    """
    Dummy Kafka consumer starter.

    We removed Kafka from the project, so this does nothing
    except log that the consumer would normally start here.
    """
    logger.info(
        "Kafka disabled. Would start consumer for topic=%s group_id=%s",
        topic,
        group_id,
    )
