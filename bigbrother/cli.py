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

import click
import logging

from .etl.channel_puller import ChannelPuller
from .core import bootstrap, Context
from . import utils

context: Context = None
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
            for act in ChannelPuller(channel):
                logger.debug('pulled new act {}'.format(act))
        except Exception as ex:
            logger.error('ETL command runs failed with error: {}'.format(ex))


@click.group()
@click.option('--config-file', '-c', help='the configuration file',
              default=utils.app_path('../config.default.yaml'))
def cli(config_file: str):
    global context
    click.echo('bootstrap based on config file: {}'.format(config_file))
    context = bootstrap(config_file)


@cli.command('etl')
def command_etl():
    ETL(context).run()


def main():
    cli()


if __name__ == '__main__':
    main()
