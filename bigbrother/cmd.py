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

import logging

from .act import Act
from .core import Context


logger = logging.getLogger(__name__)


class Cmd:

    def __init__(self, context: Context):
        self.context = context

    def run(self):
        raise NotImplementedError


class ETL(Cmd):

    def run(self):
        channel = self.context.get_channel()
        try:
            while True:
                act = channel.pull()
                logger.debug('pulled a new act {}'.format(act))
                self.persist_act(act)
        except Exception as ex:
            logger.error('ETL command runs failed with error: {}'.format(ex))

    def persist_act(self, act: Act):
        pass

    def transform_act(self, act: Act):
        pass