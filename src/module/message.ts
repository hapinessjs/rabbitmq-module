import { Channel as ChannelInterface } from 'amqplib';
import * as _has from 'lodash.has';
import { MessageOptions } from './interfaces/index';
import * as _pick from 'lodash.pick';

export function sendMessage(ch: ChannelInterface, message: any, options: MessageOptions = {}): boolean {
    let { json } = Object.assign({ json: true }, options);
    const allowedOptions = [
        'expiration',
        'userId',
        'CC',
        'mandatory',
        'persistent',
        'deliveryMode',
        'BCC',
        'contentType',
        'contentEncoding',
        'headers',
        'priority',
        'correlationId',
        'replyTo',
        'messageId',
        'timestamp',
        'type',
        'appId'
    ];
    const publishOptions = _pick(options, allowedOptions);

    if (!ch) {
        throw new Error('Cannot send a message without channel');
    }

    if (!message) {
        throw new Error('I will not send an empty message');
    }

    if (typeof json !== 'boolean') {
        json = true;
    }

    if (typeof publishOptions.headers !== 'object' || !publishOptions.headers) {
        publishOptions.headers = {};
    }

    let encodedMessage;
    if (!(message instanceof Buffer)) {
        encodedMessage = Buffer.from(json ? JSON.stringify(message) : message);
    } else {
        encodedMessage = message;
    }

    if (typeof publishOptions.headers.json !== 'boolean') {
        publishOptions.headers = {
            json
        };
    }

    if (options.queue) {
        return ch.sendToQueue(options.queue, encodedMessage, publishOptions);
    } else if (options.exchange) {
        return ch.publish(options.exchange, options.routingKey, encodedMessage, publishOptions);
    } else {
        throw new Error('Specify a queue or an exchange');
    }
}

export const decodeJSONContent = (message: any, force = false) => {
    if (!_has(message, 'content')) {
        throw new Error('Cannot decode invalid message');
    }


    if (force || (_has(message, 'fields') && _has(message, 'properties.headers') && message.properties.headers.json)) {
        try {
            return JSON.parse(message.content.toString());
        } catch (err) {
            throw new Error('Cannot parse JSON message');
        }
    }

    return message.content;
};