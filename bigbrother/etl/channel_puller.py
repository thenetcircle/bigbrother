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

from ..channel import IChannel
from .. import constants
from .act import Act


class ChannelPuller:

    def __init__(self, channel: IChannel):
        self.channel = channel
        self.index = 0
        self.buffer = []

    def __iter__(self):
        return self

    def __next__(self) -> Act:
        try:
            if len(self.buffer) <= self.index:
                self._pull_channel()
                if not self.buffer:
                    raise StopIteration

            data = self.buffer[self.index]
            self.index += 1
            return Act.from_string(data)
        except StopIteration:
            raise
        except:
            raise StopIteration

    def _pull_channel(self):
        data = self.channel.pull()
        self.buffer = data.decode('utf-8').split(constants.REQ_DELIMITER) if data else []
        self.index = 0
