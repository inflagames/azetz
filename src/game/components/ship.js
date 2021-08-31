import BaseShape from "./shared/base-shape";
import shape2 from "../shapes/ship2.json";

export default class Ship extends BaseShape {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0) {
    super(eventEmitter, x, y, width, height);
    /** @member {number} */
    this.rotation = Math.PI / 2;
    this.backgroundColor = "#00f";
    this.scaleShape = 4;

    this.updateCoordinates();
  }

  updateCoordinates(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  shipShape() {
    return this.brakedShape || this.shape || shape2;
  }

}
