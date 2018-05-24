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

import yaml
from typing import Any


class ConfigError(RuntimeError):
    """Error when fetch config items"""


class Config:

    def __init__(self, configfile):
        self.configfile = configfile
        self.config = self.from_yamlfile(self.configfile)

    def get(self, path: str, default: Any=None) -> Any:
        """get config by a path

        :param path: path of the config value, separated by dot, for example: channel.type, channel.params
        :param default: the default return value if the path can not be found
        :return:
        """
        result = self.config
        try:
            for seg in path.split('.'):
                result = result[seg]
        except:
            result = default
        return result

    def __getitem__(self, item) -> Any:
        print(item)
        return self.get(item)

    def has(self, path: str) -> bool:
        return self.get(path) is not None

    def get_configfile(self) -> str:
        return self.configfile

    def from_yamlfile(self, configfile: str) -> dict:
        try:
            with open(configfile, 'r') as f:
                return yaml.load(f)
        except IOError:
            raise

    def get_channel_config(self) -> tuple:
        channel_type = self.get('channel.type')
        if channel_type is None:
            raise ConfigError('config "channel.type" does not exist.')

        channel_params = self.get('channel.params')
        if channel_params is None:
            raise ConfigError('config "channel.params" does not exist.')

        return channel_type, channel_params

    def get_logging_config(self) -> dict:
        import logging

        logging_config = self.get('logging', {})
        if 'level' in logging_config and logging_config['level'].upper() in ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'):
            logging_config['level'] = eval('logging.{}'.format(logging_config['level'].upper()))
        else:
            logging_config['level'] = logging.DEBUG

        return logging_config
