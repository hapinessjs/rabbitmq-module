import { Queue } from '../../src/module/decorators';
import { UserExchange, EventsExchange } from './Exchanges';
import { MessageResult, QueueInterface } from '../../src/module/interfaces';
import { Observable } from 'rxjs';

@Queue({
    name: 'user.queue',
    options: {
        durable: true
    },
    channel: {
        key: 'custom-channel',
        prefetch: 1
    },
    binds: [
        {
            exchange: UserExchange,
            pattern: 'user.edited'
        },
        {
            exchange: UserExchange,
            pattern: ['user.created', 'user.deleted']
        },
        {
            exchange: UserExchange
        }
    ]
})
export class UserQueue implements QueueInterface {
    onAsserted() {
        return Observable.of(null);
    }

    onMessage(message): Observable<MessageResult> {
        return Observable.of({ ack: true });
    }
}

@Queue({
    name: 'another.queue',
    options: {
        durable: true
    },
    binds: [
        {
            exchange: UserExchange,
            pattern: 'user.*'
        },
        {
            exchange: EventsExchange,
            pattern: 'order.*'
        }
    ]
})
export class AnotherQueue implements QueueInterface {}

@Queue({
    name: 'worker',
    options: {
        durable: true
    }
})
export class WorkerQueue implements QueueInterface {}