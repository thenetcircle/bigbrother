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

from .channel import Channel
from kafka import KafkaProducer


class KafkaChannel(Channel):
    """queues the users' actions by kafka"""

    def __init__(self, topics_mapping, producer_config, consumer_config):
        """
        :param dict topics_mapping: the mapping for topic -> elem_name
        :param dict producer_config: the config dict of producer
        :param dict consumer_config: the config dict of consumer
        """
        assert type(producer_config) == dict and type(consumer_config) == dict

        self.producer_config = producer_config
        self.producer = None

        self.consumer_config = consumer_config
        self.consumer = None

    def push(self, elem):
        """
        pushes a new elem to kafka

        :param dict elem: the elem pushes to kafka, expects a {key: value} pair
        """
        def success_callback(metadata):
            pass

        def error_callback(ex):
            pass

        self.get_producer()\
            .send(self.get_elem_topic(elem), elem)\
            .add_callback(success_callback)\
            .add_errback(error_callback)

    def pull(self):
        """
        pulls a elem from a channel

        :return: the elem
        """
        raise NotImplementedError()

    def get_producer(self):
        if self.producer is None:
            self.producer = KafkaProducer(**self.producer_config)

        return self.producer

    def get_elem_topic(self, elem) -> str:
        """
        :param elem:
        :return:
        """
        pass
