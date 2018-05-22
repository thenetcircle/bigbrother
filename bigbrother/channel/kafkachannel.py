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

from .ichannel import IChannel
from ..act import Act
from kafka import KafkaProducer


class KafkaChannel(IChannel):
    """queues the users' actions by kafka"""

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
        def success_callback(metadata):
            pass

        def error_callback(ex):
            pass

        self.get_producer()\
            .send(self.get_topic(act), value=act.raw_str)\
            .add_callback(success_callback)\
            .add_errback(error_callback)

    def pull(self) -> Act:
        raise NotImplementedError()

    def get_producer(self) -> KafkaProducer:
        if self.producer is None:
            self.producer = KafkaProducer(**self.producer_config)

        return self.producer

    def get_topic(self, act: Act) -> str:
        for topic, patterns in self.topic_mapping.items():
            for _pattern in patterns:
                regex = re.compile(_pattern)
                if regex.search(act.verb):
                    return topic

        return 'default'
