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
    this.scaleShape = 4;
    this.brakedShape = null;
  }

  updateCoordinates(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  render(context) {
    // ship painted
    const shapes = this.getProjection();

    for (const shape of shapes) {
      const points = shape.points;
      if (points.length === 0) {
        continue;
      }
      context.beginPath();
      context.moveTo(scale(points[0].x), scale(points[0].y));
      for (let i = 1; i < points.length; i++) {
        context.lineTo(scale(points[i].x), scale(points[i].y));
      }
      context.closePath();
      context.fillStyle = shape.background;
      if (!this.brakedShape) {
        context.stroke();
      }
      context.fill();
    }
  }

  animate() {
    this.moveBrakedPiece();
  }

  brakeShapes() {
    const shapes = this.shipShape().shapes;

    this.brakedShape = {shapes: []}

    // brake in triangles
    for (const shape of shapes) {
      this.brakedShape = {
        shapes: [...this.brakedShape.shapes, ...this.brakeShape(shape)]
      };
    }

    // calculate direction vector
    for (const shape of this.brakedShape.shapes) {
      const cp = this.shapeCenter(shape.points);
      const d = Math.random() + 0.5;
      const factor = d / Math.sqrt(Math.pow(cp.x, 2) + Math.pow(cp.y, 2));
      shape.vector = {x: cp.x * factor, y: cp.y * factor};
    }
  }

  /**
   * @param shape {{points: {x: number, y: number}[], background: string}}
   * @return {{x: number, y: number}[]}
   */
  brakeShape(shape) {
    if (shape.points.length === 0) {
      return shape.points;
    }
    const {min, max} = this.coverBox(shape.points);

    const fixedSize = 2;
    const size = 2.5;
    const newShapes = [];
    let count = Math.ceil((max.x - min.x) * (max.y - min.y) / fixedSize);
    count = Math.min(count, 150);

    for (let i = 0; i < count; i++) {
      const pos = {x: (max.x - min.x) * Math.random() + min.x, y: (max.y - min.y) * Math.random() + min.y};
      newShapes.push({
        points: new Array(3).fill(null)
          .map(() => ({x: pos.x + size * Math.random(), y: pos.y + size * Math.random()})),
        background: shape.background,
      });
    }

    return newShapes;
  }

  /**
   * @param points {{x: number, y: number}[]}
   */
  shapeCenter(points) {
    const {min, max} = this.coverBox(points);
    return {x: (max.x + min.x) / 2, y: (max.y + min.y) / 2};
  }

  coverBox(points) {
    const min = {x: points[0].x, y: points[0].y}, max = {...min};
    for (let i = 1; i < points.length; i++) {
      min.x = Math.min(min.x, points[i].x);
      min.y = Math.min(min.y, points[i].y);
      max.x = Math.max(max.x, points[i].x);
      max.y = Math.max(max.y, points[i].y);
    }
    return {min, max};
  }

  moveBrakedPiece() {
    if (this.brakedShape) {
      for (const shape of this.brakedShape.shapes) {
        shape.points = shape.points.map((p) => ({x: p.x + shape.vector.x, y: p.y + shape.vector.y}));
        shape.background = this.reduceOpacity(shape.background, 30);
      }
    }
  }

  /**
   * @param color {string}
   * @param extract {number}
   * @returns {string}
   */
  reduceOpacity(color, extract) {
    let alpha = this.getOpacity(color);
    alpha = Math.min(255, Math.max(alpha - extract, 0));
    alpha = alpha.toString(16);
    return `#${color.substr(1, 6)}${(alpha.length < 2 ? "0" : "") + alpha}`;
  }

  /**
   * @param color {string}
   * @return {number}
   */
  getOpacity(color) {
    return color.length > 7 ? parseInt(color.substr(7, 2), 16) : 255;
  }

  /**
   * @return {{points: {x: number, y: number}[], background: string, smoke: boolean}[]}
   */
  getProjection() {
    const rotation = this.rotation + Math.PI / 2;

    const shapes = this.shipShape().shapes;
    const pivot = {x: this.x, y: this.y};

    const projectedShape = [];

    for (const shape of shapes) {
      const points = shape.points.map(p => ({x: p.x * this.scaleShape, y: p.y * this.scaleShape}));
      for (let i = 0; i < points.length; i++) {
        points[i] = getPointByVectorRotation(points[i], pivot, rotation);
      }
      projectedShape.push({...shape, points});
    }
    return projectedShape;
  }

  /**
   * @returns {{shapes: {background: string, points: {x: number, y: number}}[]}}
   */
  shipShape() {
    return {
      shapes: [],
    };
  }
}
