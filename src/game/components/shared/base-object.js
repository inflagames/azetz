import Observable, {filterObservable, takeUntil} from "../../utils/observable";
import {EVENT_CLICK, EVENT_MOUSELEAVE, EVENT_MOUSEOUT, EVENT_TOUCHCANCEL, EVENT_TOUCHUP} from "../../utils/variables";

export default class BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0) {
    this.destroy = new Observable();
    /** @member {Observable} */
    this.eventEmitter = eventEmitter;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.lastMousePosition = null;
    this.isMouseHover = false;

    // toDo guille 27.08.21: improve this random value to be unique
    this.id = Math.random() * 1000000;
  }

  set eventEmitter(value) {
    this._eventEmitter = value ? value.pipe(takeUntil(this.destroy)) : value;
  }

  get eventEmitter() {
    return this._eventEmitter;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
  }

  /**
   * Event listener
   * @param event {string}
   * @param callback {function}
   */
  listenerEvent(event, callback) {
    this.eventEmitter
      .pipe(filterObservable((data) => data.event === event))
      .on((data) => {
        if (data && this.validateEventPropagation(data.position, data.event)) {
          callback(data);
        }
      });
  }

  /**
   * @param position {{x: number, y: number}}
   * @param event {string}
   * @return {boolean}
   */
  validateEventPropagation(position, event) {
    if (event === EVENT_TOUCHUP || event === EVENT_MOUSEOUT ||
      event === EVENT_TOUCHCANCEL || event === EVENT_MOUSELEAVE) {
      return true;
    }
    if (this.isPositionInside(this.lastMousePosition) && !this.isPositionInside(position)) {
      this.eventEmitter.emit({event: EVENT_MOUSEOUT});
    }
    this.lastMousePosition = position;
    return (this.isMouseHover = this.isPositionInside(position));
  }

  isPositionInside(position) {
    return position && position.x >= this.x &&
      position.x <= this.x + this.width &&
      position.y >= this.y &&
      position.y <= this.y + this.height;
  }
}
