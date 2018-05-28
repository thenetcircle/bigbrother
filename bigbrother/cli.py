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
from .core import bootstrap, Context
from . import utils
from .cmd import ETL

context: Context = None


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
