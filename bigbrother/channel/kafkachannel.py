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

import re
import logging

from .ichannel import IChannel
from ..act import Act
from kafka import KafkaProducer, KafkaConsumer

logger = logging.getLogger(__name__)


class KafkaChannel(IChannel):
    """line users' acts by kafka"""

    def __init__(self, producer_config: dict, consumer_config: dict, topics_mapping: dict, log_level: str):
        """
        :param producer_config: the config dict of producer
        :param consumer_config: the config dict of consumer
        :param topics_mapping: the mapping for topic -> tuple(patterns)
        """
        assert type(producer_config) == dict and type(consumer_config) == dict

        self.producer_config = producer_config
        self.producer = None

        self.consumer_config = consumer_config
        self.consumer = None

        self.topic_mapping = topics_mapping

        self.log_level = log_level.upper() if log_level else 'INFO'

    def push(self, act: Act) -> None:
        topic = self.get_produce_topic(act)
        logger.debug('pushing act "{}" to topic "{}"'.format(act, topic))

        self.get_producer()\
            .send(topic, value=act.raw_str.encode('utf-8'))\
            .add_callback(self.on_push_success)\
            .add_errback(self.on_push_error)

    def pull(self) -> Act:
        return next(self.get_consumer())

    def get_producer(self) -> KafkaProducer:
        if self.producer is None:
            try:
                self.set_kafka_log_level()
                self.producer = KafkaProducer(**self.producer_config)
            except Exception as ex:
                logger.error(ex)
                raise

        return self.producer

    def get_produce_topic(self, act: Act) -> str:
        for topic, patterns in self.topic_mapping.items():
            for _pattern in patterns:
                regex = re.compile(_pattern)
                if regex.search(act.verb):
                    return topic

        return 'default'

    def get_consumer(self) -> KafkaConsumer:
        if self.consumer is None:
            try:
                self.set_kafka_log_level()
                self.consumer = KafkaConsumer(**self.consumer_config)
                topics = self.get_consume_topics()
                logger.info('created a new KafkaConsumer and subscribing to topics {}'.format(topics))
                self.consumer.subscribe(topics)
            except Exception as ex:
                logger.error(ex)
                raise

        return self.consumer

    def get_consume_topics(self) -> list:
        return list(self.topic_mapping.keys())

    def set_kafka_log_level(self):
        logging.getLogger('kafka').setLevel(eval('logging.{}'.format(self.log_level)))

    @staticmethod
    def on_push_success(metadata):
        pass
        # logger.debug('push to kafka success, topic: {}', metadata.topic)

    @staticmethod
    def on_push_error(excp):
        logger.error('push a act to kafka failed', exc_info=excp)

    @staticmethod
    def on_consumer_rebalance():
        logger.debug('consumer rebalance')
