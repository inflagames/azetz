import BaseObject from "./shared/base-object";
import {scale} from "../utils/helpers";

/**
 * This component didn't render anything, it is only used for create a touching area in the game
 */
export default class TouchArea extends BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0) {
    super(eventEmitter, x, y, width, height);
  }

  render(context) {
    context.beginPath();
    context.strokeStyle = "#f00";
    context.rect(scale(this.x), scale(this.y), scale(this.width), scale(this.height));
    context.stroke();
  }
}
