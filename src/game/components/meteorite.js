import BaseShape from "./shared/base-shape";
import {getVector, randomNumber, rotateVector} from "../utils/helpers";

export default class Meteorite extends BaseShape {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param ratio {number}
   */
  constructor(eventEmitter, x = 0, y = 0, ratio = 0) {
    ratio += (ratio / 2) * Math.random();
    super(eventEmitter, x, y, ratio, 0);
    this.rotationAnimate = Math.PI / 30 * Math.random() * (randomNumber(2) ? 1 : -1);
    this.expectedX = 0;

    this.generateShape();
    this.updateCoordinates();
  }

  shipShape() {
    return this.brakedShape || this.shape;
  }

  generateShape() {
    let points = [];
    const startPoints = 6;
    const iterations = 4;
    const angle = (Math.PI * 2) / startPoints;
    for (let i = 0; i < startPoints; i++) {
      points.push(rotateVector({x: this.width / 2, y: 0}, angle * i));
    }
    for (let i = 0; i < iterations; i++) {
      const newPoints = [points[0]];
      for (let j = 1; j < points.length; j++) {
        newPoints.push(this.randomMiddlePoint(points[j - 1], points[j]));
        newPoints.push(points[j]);
      }
      newPoints.push(this.randomMiddlePoint(points[points.length - 1], points[0]));
      points = newPoints;
    }
    this.shape = {shapes: [{background: "#b3b3b3", points}]};
  }

  randomMiddlePoint(p1, p2) {
    const mp = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
    const v1 = getVector(p1, p2);
    const v2 = rotateVector(v1, Math.PI / 2);
    const factor = randomNumber(3, -1) / 7;
    return {
      x: mp.x + v2.x * factor,
      y: mp.y + v2.y * factor,
    };
  }

  animate() {
    super.animate();
    if (!this.brakedShape) {
      this.rotation += this.rotationAnimate;
    }
  }
}
