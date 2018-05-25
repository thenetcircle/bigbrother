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

import os
import sys

from .channel import IChannel, create_channel
from . import constants
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


def choose_configfile() -> str:
    """found config file based on app arguments or environment variable etc..."""
    arg_configfile = ''
    try:
        if len(sys.argv) > 1:
            for i, arg in enumerate(sys.argv):
                if (arg == '--config-file' or arg == '-c') and len(sys.argv) > i+1:
                    arg_configfile = sys.argv[i+1]
    except:
        pass

    if arg_configfile:
        return arg_configfile
    elif os.environ.get(constants.ENV_CONFIGFILE):
        return os.environ.get(constants.ENV_CONFIGFILE)
    else:
        raise RuntimeError('can not found proper config file.')


context = bootstrap(choose_configfile())
