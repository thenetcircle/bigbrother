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

import unittest
import os

from bigbrother import constants


class ConfigTest(unittest.TestCase):

    def setUp(self):
        self.test_configfile = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', 'config.test.yaml')
        os.environ.setdefault(constants.EnvConstants.CONFIGFILE, self.test_configfile)

        from bigbrother.config import config
        self.config = config

    def test_load(self):
        self.assertEqual(self.config.get_configfile(), self.test_configfile)

    def test_get(self):
        self.assertEqual(self.config.get('channel.type'), 'kafka')
        self.assertEqual(self.config.get('channel.params.topics_mapping'), { 'topic1': 'verb' })


if __name__ == '__main__':
    unittest.main()