import { filterObservable } from "../../utils/observable";

export default class BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0) {
    /** @member {Observable} */
    this.eventEmitter = eventEmitter;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {}

  /**
   * Event listener
   * @param event {string}
   * @param callback {function}
   */
  listenerEvent(event, callback) {
    this.eventEmitter
      .pipe(filterObservable((data) => data.event === event))
      .on((data) => {
        const position = data.position;
        if (
          position.x >= this.x &&
          position.x <= this.x + this.width &&
          position.y >= this.y &&
          position.y <= this.y + this.height
        ) {
          callback();
        }
      });
  }
}
