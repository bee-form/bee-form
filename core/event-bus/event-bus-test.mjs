import {createEventBus} from "./event-bus";

const eventBus = createEventBus();

eventBus.addEvent({
    init: (resolve) => {
        let timeout = setTimeout(() => {
            resolve(() => {
                console.log(333);
            });
        }, 2000);

        return () => clearTimeout(timeout);
    },
});

eventBus.invoke(() => {
    console.log(123);
});