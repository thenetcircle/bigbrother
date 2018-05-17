from .channel.channel import Channel
from .channel.kafkachannel import KafkaChannel

channels = dict(kafka=KafkaChannel)


def create_channel(type, **params):
    """channel factory_method

    :param str type: channel type
    :param dict params: channel params
    :return: a channel implementation
    :rtype: Channel
    """
    return channels[type](**params)