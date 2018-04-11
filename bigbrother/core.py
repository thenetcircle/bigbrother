# -*- coding: utf-8 -*-

"""
bigbrother.core
~~~~~~~~~~~~

Providers core functions
"""

import os

from flask import Flask

templateDir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

app = Flask(__name__, template_folder=templateDir)
app.debug = bool(os.environ.get('DEBUG'))