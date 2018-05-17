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


class ConfigTest(unittest.TestCase):

    def setUp(self):
        test_configfile = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fixtures', 'config.test.yaml')
        os.environ.setdefault('BIGBROTHER_CONFIG', test_configfile)
        from bigbrother.config import config
        self.config = config

    def test_loadconfig(self):
        self.assertEqual(1, 1)


if __name__ == '__main__':
    unittest.main()