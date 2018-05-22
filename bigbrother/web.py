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

import gzip
import json

from flask import Flask, request

from . import utils
from .act import Act
from .factories import ChannelFactory

templateDir = utils.app_path('templates')

app = Flask(__name__, template_folder=templateDir)


def json_response(data=None, code=0, error=''):
    resp = {code: code}
    if data:
        resp['data'] = data
    if error != '':
        resp['error'] = error
    return json.dumps(resp)


@app.route('/')
def home():
    return 'this is the home page3'


@app.route('/api/beehive', methods=['POST'])
def beehive():
    delimiter = '|||'
    is_compressed = request.args.get('g', '') == '1'

    body = request.data
    if is_compressed:
        body = gzip.decompress(body).decode('utf-8')

    channel = ChannelFactory.get_channel()

    for req_str in body.split(delimiter):
        try:
            act = Act.from_request(req_str)
            channel.push(act)
        except:
            pass

    return json_response()
