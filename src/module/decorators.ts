import { Type } from '@hapiness/core';
import { createDecorator, CoreDecorator } from '@hapiness/core/core/decorators';
import { Options } from 'amqplib';
import { ExchangeType } from './interfaces/index';

export interface Bind {
    exchange: Type<any>;
    pattern?: string | [string];
}

export interface ChannelOptions {
    key: string;
    prefetch?: number;
}

export interface QueueDecoratorInterface {
    name: string;
    binds?: Array<Bind>;
    options?: Options.AssertQueue;
    channel?: ChannelOptions;
    force_json_decode?: boolean;
}
export const Queue: CoreDecorator<QueueDecoratorInterface> = createDecorator<QueueDecoratorInterface>('Queue', {
    name: undefined,
    binds: undefined,
    options: undefined,
    channel: undefined,
    force_json_decode: false
});

export interface ExchangeDecoratorInterface {
    name: string;
    type: ExchangeType;
    options?: Options.AssertExchange;
    channel?: ChannelOptions;
}
export const Exchange: CoreDecorator<ExchangeDecoratorInterface> = createDecorator<ExchangeDecoratorInterface>('Exchange', {
    name: undefined,
    type: undefined,
    options: undefined,
    channel: undefined
});

export interface MessageDecoratorInterface {
    queue: Type<any>;
    exchange?: Type<any>;
    isFallback?: boolean;
    routingKey?: string | RegExp;
    filter?: {
        [key: string]: string | RegExp;
    };
}
export const Message: CoreDecorator<MessageDecoratorInterface> = createDecorator<MessageDecoratorInterface>('Message', {
    queue: undefined,
    exchange: undefined,
    isFallback: false,
    routingKey: undefined,
    filter: undefined
});