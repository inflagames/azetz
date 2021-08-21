export default class Observable {

  constructor() {
    /** @member {function[]} */
    this.subscriptions = [];
  }

  /**
   * @param data {Object}
   */
  emit(data) {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.callFunction(this.subscriptions[i], data);
    }
  }

  async callFunction(func, data) {
    func(data);
  }

  /**
   * @param func {function}
   * @return {Observable}
   */
  pipe(func) {
    const stream = new Observable();
    this.subscriptions.push((data) => func(data, stream));
    return stream;
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
 * @param func {function}
 */
export function filterObservable(func) {
  return (data, /** @param {Observable} */ observable) => {
    if (func(data)) {
      observable.emit(data);
    }
  }
}
