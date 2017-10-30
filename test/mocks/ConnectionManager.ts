import { ConnectionManager } from '../../src/index';
import { RabbitConnectionMock } from './RabbitConnection';
import { ChannelMock } from './Channel';
import { Observable } from 'rxjs';
import { Connection } from 'amqplib';

const debug = require('debug')('hapiness:rabbitmq');

export class ConnectionManagerMock extends ConnectionManager {
    constructor() {
        super(<any>{});
        this['_isConnected'] = true;
        this['_connection'] = <any>new RabbitConnectionMock();
        this['_defaultChannel'] = <any>new ChannelMock();
    }

    connect(): Observable<Connection> {
        debug('Mocking connection...');
        return Observable.of(this['_connection']).delay(500);
    }
}