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

from .config import config
from .channel.ichannel import IChannel
from .channel.kafkachannel import KafkaChannel


class ChannelFactory:

    _channel = None
    _channel_classes = dict(kafka=KafkaChannel)

    @staticmethod
    def get_channel() -> IChannel:
        if ChannelFactory._channel is None:
            channel_config = config.get_channel_config()
            ChannelFactory._channel = ChannelFactory._create_channel(channel_config['type'], channel_config['params'])

        return ChannelFactory._channel

    @staticmethod
    def _create_channel(type: str, params: dict) -> IChannel:
        """channel factory_method

        :param type: channel type
        :param params: channel params
        :return: a channel implementation
        """
        return ChannelFactory._channel_classes[type](**params)