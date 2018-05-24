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

channel_classes = dict(kafka=KafkaChannel)


def create_channel(type: str, params: dict) -> IChannel:
    """creates a channel based on the parameters

    :param type: channel type
    :param params: channel params
    :return: a IChannel implementation
    """
    if type not in channel_classes:
        raise RuntimeError('channel type {} is not supported.'.format(type))

    return channel_classes[type](**params)
