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

from .channel import IChannel, create_channel
from .config import Config


class Context:

    channel = None

    def __init__(self, config: Config):
        self.config = config

    def get_channel(self) -> IChannel:
        if self.channel is None:
            channel_type, channel_params = self.config.get_channel_config()
            self.channel = create_channel(channel_type, channel_params)

        return self.channel


def setup_logging(config: Config) -> None:
    import logging
    logging_config = config.get_logging_config()
    logging.basicConfig(**logging_config)


def bootstrap(configfile):
    config = Config(configfile)
    setup_logging(config)
    return Context(config)
