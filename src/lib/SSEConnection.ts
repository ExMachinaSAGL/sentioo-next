import {
  NativeEventSource,
  EventSourcePolyfill
} from 'event-source-polyfill';

const EventSource = NativeEventSource || EventSourcePolyfill;

export interface SSEEvent extends Event {
  lastEventId: number;
  data: string;
}

export const DefaultEvents = {
  ERROR: 'error',
  OPEN: 'open',
  CLOSE: 'close'
}

export const SSEReadyStates = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2
};

// declare let window : any;

export class SSEConnection {
  source: any;
  listeners: {
    // eslint-disable-next-line
    [key: string ]: (evt: SSEEvent) => void
  };

  constructor (url: string) {
    // this.source = new window['EventSource'](url, {withCredentials: true});
    this.source = new EventSource(url, {withCredentials: true});
    this.listeners = {};
  }

  get readyState (): number {
    return this.source.readyState;
  }

  /**
   * Add or update a listener of the given type
   * @param type Event type that should trigger the event
   * @param callback Handles the event
   */
  // eslint-disable-next-line
  on (type: string, callback: (evt: SSEEvent) => void): void {
    if (type in this.listeners) { // remove it, if it already exists
      this.removeEvent(type);
    }
    this.source.addEventListener(type, callback);
    this.listeners[type] = callback;
  }

  onError (callback: (/*evt: SSEEvent*/) => void): void {
    this.on(DefaultEvents.ERROR, callback);
  }

  onOpen (callback: (/*evt: SSEEvent*/) => void): void {
    this.on(DefaultEvents.OPEN, callback);
  }

  onClose (callback: (/*evt: SSEEvent*/) => void): void {
    this.on(DefaultEvents.CLOSE, callback);
  }

  removeEvent (type: string): void {
    // eslint-disable-next-line
    const callback: (evt: SSEEvent) => void = this.listeners[type];
    if (callback) {
      this.source.removeEventListener(type, callback)
      delete this.listeners[type];
    }
  }

  /**
   * Close the SSE connection and remove all listeners.
   */
  close () {
    if (this.source) {
      this.source.close();
      Object.keys(this.listeners).forEach((key) => {
        this.source.removeEventListener(key, this.listeners[key]);
      });
      this.listeners = {};
    }
  }
}
