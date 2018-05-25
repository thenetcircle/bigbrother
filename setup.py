from setuptools import setup

setup(
    name='bigbrother',
    version='0.1',
    packages=['bigbrother'],
    author='Benn Ma',
    author_email='bennmsg@gmail.com',
    entry_points={
        'console_scripts': [
            'bigbrother = bigbrother.cli:main'
        ]
    }
)