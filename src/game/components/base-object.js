export default class BaseObject {
  /**
   * @param eventEmitter {EventEmitter}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x= 0, y= 0, width= 0, height= 0) {
    this.eventEmitter = eventEmitter;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
    this.eventEmitter.on(event, (position) => {
      if (position.x >= this.x && position.x <= this.x + this.width &&
        position.y >= this.y && position.y <= this.y + this.height) {
        callback();
      }
    });
  }
}
