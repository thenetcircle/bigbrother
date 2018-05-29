# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import logging
from typing import Union

from kafka import KafkaProducer, KafkaConsumer

from .ichannel import IChannel

logger = logging.getLogger(__name__)


class KafkaChannel(IChannel):
    """line users' acts by kafka"""

    def __init__(self, producer_config: dict, consumer_config: dict, topic: str, log_level: str):
        """
        :param producer_config: the config dict of producer
        :param consumer_config: the config dict of consumer
        :param topic:
        :param log_level: the logging level of kafka-python
        """
        assert producer_config and consumer_config and topic, 'producer_config, consumer_config and topic are required.'

        self.producer_config = producer_config
        self.producer = None
        self.consumer_config = consumer_config
        self.consumer = None
        self.topic = topic
        self.log_level = log_level.upper() if log_level else 'INFO'

    def push(self, data: Union[str, bytes]) -> None:
        if type(data) is str:
            data = data.encode('utf-8')
        self.get_producer()\
            .send(self.topic, value=data)\
            .add_callback(self.on_push_success)\
            .add_errback(self.on_push_error)

    def pull(self) -> bytes:
        consumer_record = next(self.get_consumer())
        return consumer_record.value if consumer_record else b''

    def get_producer(self) -> KafkaProducer:
        if self.producer is None:
            try:
                self.set_kafka_log_level()
                self.producer = KafkaProducer(**self.producer_config)
            except Exception as ex:
                logger.error(ex)
                raise

        return self.producer

    def get_consumer(self) -> KafkaConsumer:
        if self.consumer is None:
            try:
                self.set_kafka_log_level()
                self.consumer = KafkaConsumer(**self.consumer_config)
                logger.info('created a new KafkaConsumer and subscribing to topic {}'.format(self.topic))
                self.consumer.subscribe([self.topic])
            except Exception as ex:
                logger.error(ex)
                raise

        return self.consumer

    def set_kafka_log_level(self):
        logging.getLogger('kafka').setLevel(eval('logging.{}'.format(self.log_level)))

    @staticmethod
    def on_push_success(metadata):
        pass
        # logger.debug('push to kafka success, topic: {}', metadata.topic)

    @staticmethod
    def on_push_error(excp):
        logger.error('push a act to kafka failed', exc_info=excp)
