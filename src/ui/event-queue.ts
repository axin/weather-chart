import { UiEvent } from "./ui-event";

export class EventQueue {
    private _events: UiEvent[] = [];

    get events() {
        return this._events;
    }

    addEvent(event: UiEvent, throttle = false) {
        // It throttle === true, we squash series of events of the same type into one event.
        // It is usefull for getting rid of excessive events.
        if (throttle && this._events.length) {
            const lastEventIndex = this._events.length - 1;
            const lastEvent = this._events[lastEventIndex];

            if (event.type === lastEvent.type) {
                this._events[lastEventIndex] = event;

                return;
            }
        }

        this._events.push(event);
    }

    clear() {
        this._events.length = 0;
    }
}
