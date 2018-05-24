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
from kafka import KafkaProducer


logger = logging.getLogger(__name__)


class KafkaChannel(IChannel):
    """line users' acts by kafka"""

    def __init__(self, producer_config: dict, consumer_config: dict, topics_mapping: dict):
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

    def push(self, act: Act) -> None:
        topic = self.get_topic(act)

        logger.debug('going to push act "{} - {}" to topic "{}"'.format(act.sid, act.verb, topic))

        self.get_producer()\
            .send(topic, value=act.raw_str)\
            .add_callback(KafkaChannel.on_push_success)\
            .add_errback(KafkaChannel.on_push_error)

        self.get_producer().flush()

    def pull(self) -> Act:
        raise NotImplementedError()

    def get_producer(self) -> KafkaProducer:
        if self.producer is None:
            try:
                self.producer = KafkaProducer(**self.producer_config)
            except Exception as ex:
                logger.error(ex)
                raise

        return self.producer

    def get_topic(self, act: Act) -> str:
        for topic, patterns in self.topic_mapping.items():
            for _pattern in patterns:
                regex = re.compile(_pattern)
                if regex.search(act.verb):
                    return topic

        return 'default'

    @staticmethod
    def on_push_success(metadata):
        logger.debug(
            'push to kafka success, topic: {}, partition: {}, offset: {}',
            metadata.topic,
            metadata.partition,
            metadata.offset
        )

    @staticmethod
    def on_push_error(excp):
        logger.error('push to kafka failed', exc_info=excp)
