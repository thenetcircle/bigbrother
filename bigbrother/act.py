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

import json


class Act:

    @staticmethod
    def from_request(raw_str):
        assert type(raw_str) in (str, bytes, bytearray) and raw_str != ''
        raw_obj = json.loads(raw_str)
        return Act(raw_obj['sid'], raw_obj['seq'], raw_obj['verb'], raw_obj['time'], raw_obj['data'], raw_str)

    def __init__(self, sid, seq, verb, time=None, data=None, raw_str=None):
        """expresses the acts in Scenario

        :param str sid: a session id ties these serial of acts
        :param str seq: sequence numbers of this act in the session
        :param str verb: the verb of the act
        :param str time: the act happens time
        :param dict data: data of the act
        """
        self.sid = sid
        self.seq = seq
        self.verb = verb
        self.time = time
        self.data = data if data is not None else {}
        self.raw_str = raw_str
