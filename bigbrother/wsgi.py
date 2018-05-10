# -*- coding: utf-8 -*-

"""
bigbrother.app
~~~~~~~~~~~~

Providers the entrance
"""

import os
import argparse

from flask import Flask

templateDir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

app = Flask(__name__, template_folder=templateDir)
app.debug = bool(os.environ.get('DEBUG'))

@app.route('/')
def home_page():
    return 'this is the home page3'

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=5000)
    parser.add_argument("--host", default="127.0.0.1")
    args = parser.parse_args()
    app.run(port=args.port, host=args.host)