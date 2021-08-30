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
    // ship painted
    const shapes = this.getProjection();

    for (let shape of shapes) {
      const points = shape.points;
      context.beginPath();
      context.moveTo(scale(points[0].x), scale(points[0].y));
      for (let i = 1; i < points.length; i++) {
        context.lineTo(scale(points[i].x), scale(points[i].y));
      }
      context.closePath();
      context.fillStyle = shape.background;
      context.fill();
    }
  }

  /**
   * @return {{points: {x: number, y: number}[], background: string}[]}
   */
  getProjection() {
    const rotation = this.rotation + Math.PI / 2;

    const shapes = this.shipShape();
    const pivot = {x: this.x, y: this.y};

    const projectedShape = [];

    for (let shape of shapes) {
      const points = shape.points.map(p => ({x: p.x * this.scaleShape, y: p.y * this.scaleShape}));
      for (let i = 0; i < points.length; i++) {
        points[i] = getPointByVectorRotation(points[i], pivot, rotation);
      }
      projectedShape.push({...shape, points});
    }
    return projectedShape;
  }

  /**
   * @returns {[]}
   */
  shipShape() {
    return [];
  }
}
