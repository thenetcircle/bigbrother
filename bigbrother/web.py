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
import argparse
import gzip

from flask import Flask, request
from .utils import Utils

templateDir = Utils.app_path('templates')

app = Flask(__name__, template_folder=templateDir)
app.debug = bool(os.environ.get('DEBUG'))


@app.route('/')
def home():
    return 'this is the home page3'


@app.route('/api/beehive', methods=['POST'])
def beehive():
    delimiter = '|||'
    isCompressed = request.args.get('g', '') == '1'

    body = request.data
    if isCompressed:
        body = gzip.decompress(body).decode('utf-8')

    for record in body.split(delimiter):
        print(record)

    return 'done'


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5000)
    parser.add_argument("--host", default="127.0.0.1")
    args = parser.parse_args()
    app.run(port=args.port, host=args.host)