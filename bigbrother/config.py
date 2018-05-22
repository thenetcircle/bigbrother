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
import yaml
from typing import Any

from . import constants


class IllegalConfigError(Exception):
    def __init__(self, path='', error=None):
        self.path = path
        self.error = error


class _AppConfig:

    def __init__(self):
        self.configfile = self._get_configfile()
        self.config = self._load_configfile(self.configfile)
        # TODO: check config?

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

    def has(self, path: str) -> bool:
        return self.get(path) is not None

    def get_configfile(self) -> str:
        return self.configfile

    def get_channel_config(self) -> dict:
        """
        :return: tuple (channel_type, channel_params)
        """
        channel_name = self.get('app.channel')
        if channel_name is None:
            raise IllegalConfigError('app.channel')

        channel_path = 'channels.{}'.format(channel_name)
        channel_config = self.get(channel_path)
        if channel_config is None:
            raise IllegalConfigError(channel_path)

        return channel_config

    @staticmethod
    def _load_configfile(configfile: str) -> Any:
        try:
            with open(configfile, 'r') as f:
                return yaml.load(f)
        except IOError:
            raise

    @staticmethod
    def _get_configfile() -> str:
        """returns configfile specified by app arguments or environment variable"""
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
        elif os.environ.get(constants.EnvConstants.CONFIGFILE):
            return os.environ.get(constants.EnvConstants.CONFIGFILE)
        else:
            raise Exception('configuration file is not set.')


config = _AppConfig()
