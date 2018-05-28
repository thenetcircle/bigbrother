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

from .ichannel import IChannel
from .kafkachannel import KafkaChannel
from .. import constants

channel_classes = dict(kafka=KafkaChannel)


def create_channel(config) -> IChannel:
    """creates a channel based on config

    :param config:
    :return: a IChannel implementation
    """
    channel_type, channel_params = _parse_channel_config(config)

    if channel_type not in channel_classes:
        raise RuntimeError('channel type {} is not supported.'.format(channel_type))

    return channel_classes[channel_type](**channel_params)


def _parse_channel_config(config) -> tuple:
    channel_config = config[constants.CONF_CHANNEL]

    channel_type = channel_config['type']
    if channel_type is None:
        raise RuntimeError('config "{}.type" does not exist.'.format(constants.CONF_CHANNEL))

    channel_params = channel_config['params']
    if channel_params is None:
        raise RuntimeError('config "{}.params" does not exist.'.format(constants.CONF_CHANNEL))

    return channel_type, channel_params