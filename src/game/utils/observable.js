export default class Observable {
  constructor() {
    /** @member {function[]} */
    this.subscriptions = [];
    this.open = true;
  }

  /**
   * @param data {Object}
   */
  emit(data = {}) {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.callFunction(this.subscriptions[i], data);
    }
  }

  async callFunction(func, data) {
    func(data);
  }

  /**
   * @param functions {function}
   * @return {Observable}
   */
  pipe(...functions) {
    let lastSteam = this;
    for (const func of functions) {
      const stream = new Observable();
      lastSteam.on((data) => func(data, stream));
      lastSteam = stream;
    }
    return lastSteam;
  }

  /**
   * @param func {function}
   */
  unsub(func) {
    this.subscriptions = this.subscriptions.filter((f) => f !== func);
  }

  /**
   * @param func {function}
   */
  on(func) {
    this.subscriptions.push(func);
  }
}

/**
 * Filter the value of an Observable
 * @param stopper {Observable}
 */
export function takeUntil(stopper) {
  let streamCancel = false;
  const cancelFunction = () => {
    streamCancel = true;
    stopper.unsub(cancelFunction);
  };
  stopper.on(cancelFunction);
  return (data, /** @param {Observable} */ observable) => {
    if (streamCancel) {
      observable.subscriptions = [];
    }
    observable.emit(data);
  };
}

/**
 * Filter the value of an Observable
 * @param func {function}
 */
export function filterObservable(func) {
  return (data, /** @param {Observable} */ observable) => {
    if (func(data)) {
      observable.emit(data);
    }
  };
}

/**
 * The value of the observable can be mapped and returned with transformations
 * @param func {function}
 */
export function mapObservable(func) {
  return (data, /** @param {Observable} */ observable) => {
    observable.emit(func(data));
  };
}
