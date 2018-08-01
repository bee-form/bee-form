import {addRemove} from "../common/utils/collections";

export function createEventBus(state, events = [], {afterReduce}) {

    const listeners = [];
    
    const purge = () => {
        for (let i = events.length - 1; i >= 0; i--) {
            const event = events[i];
            if (event.deprecated && event.deprecated(state)) {
                event.cancel();
                events.splice(i, 1);
            }
        }
    };

    const convertEventFeed = ({init, deprecated, description}) => {
        let cancelled = false;

        const event = {
            deprecated,
            description,
        };

        const resolve = (reduce) => {
            if (cancelled) {
                return;
            }

            state = afterReduce(reduce(state));
            events.splice(events.indexOf(event), 1);
            purge();

            listeners.forEach((l) => l());
        };

        const cancel = init(resolve);

        if (cancel) {
            event.cancel = () => {
                cancelled = true;
                cancel();
            };
        } else {
            event.cancel = () => cancelled = true;
        }

        return event;
    };

    events = events.map(convertEventFeed);

    return {
        invoke: (reduce) => {
            state = afterReduce(reduce(state));
            purge();
            // console.log(state)
            listeners.forEach((l) => l());
        },
        addEvent: ({init, deprecated, description}) => {
            events.push(convertEventFeed({init, deprecated, description}));
            // console.log(`${Date.now()} A: ${description}`);
        },
        getState: () => state,
        onChange: addRemove(listeners),
    };
}

