import BaseObject from "./base-object";
import {getPointByVectorRotation, scale} from "../../utils/helpers";

export default class BaseShape extends BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0) {
    super(eventEmitter, x, y, width, height);
    this.backgroundColor = "#00f";
    this.rotation = 0;
    this.scaleShape = 1;
  }

  updateCoordinates(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  render(context) {
    const rotation = this.rotation + Math.PI / 2;

    // ship painted
    const shapes = this.shipShape();
    const pivot = {x: this.x, y: this.y};

    for (let shape of shapes) {
      const points = shape.points.map(p => ({x: p.x * this.scaleShape, y: p.y * this.scaleShape}));
      context.beginPath();
      let position = getPointByVectorRotation(points[0], pivot, rotation);
      context.moveTo(scale(position.x), scale(position.y));
      for (let i = 1; i < points.length; i++) {
        let position = getPointByVectorRotation(points[i], pivot, rotation);
        context.lineTo(scale(position.x), scale(position.y));
      }
      context.closePath();
      context.fillStyle = shape.background;
      context.fill();
    }
  }

  /**
   * @returns {[]}
   */
  shipShape() {
    return [];
  }
}
