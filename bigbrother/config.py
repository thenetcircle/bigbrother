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

from .constants import Constants


class _AppConfig:

    def __init__(self):
        self.configfile = self._get_configfile()
        self.config = self._load_configfile(self.configfile)
        # TODO: check config?

    def get(self, path, default=None):
        """get config by a path

        :param str path: path of the config value, separated by dot, for example: channel.type, channel.params
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

    def get_configfile(self):
        return self.configfile

    @staticmethod
    def _load_configfile(configfile):
        try:
            with open(configfile, 'r') as f:
                return yaml.load(f)
        except IOError:
            raise

    @staticmethod
    def _get_configfile():
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
        elif os.environ.get(Constants.ENV_CONFIGFILE):
            return os.environ.get(Constants.ENV_CONFIGFILE)
        else:
            raise Exception('configuration file is not set.')


config = _AppConfig()
