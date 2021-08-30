import BaseObject from "./shared/base-object";
import {rotateVector, scale} from "../utils/helpers";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../game";
import {SHIP_PADDING_Y, TOUCH_AREA_SIZE} from "../scenes/play.scene";
import shapes from '../shapes/ship3.json';

/**
 * This component didn't render anything, it is only used for create a touching area in the game
 */
export class TouchArea extends BaseObject {
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
    // toDo guille 27.08.21: remove this code
    context.beginPath();
    context.strokeStyle = "#f00";
    context.rect(scale(this.x), scale(this.y), scale(this.width), scale(this.height));
    context.stroke();
  }
}

export default class Ship extends BaseObject {
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

    this.shipTouchArea = new TouchArea(eventEmitter, SCREEN_WIDTH / 2 - TOUCH_AREA_SIZE / 2,
      SCREEN_HEIGHT - SHIP_PADDING_Y - TOUCH_AREA_SIZE / 2, TOUCH_AREA_SIZE, TOUCH_AREA_SIZE);

    this.updateCoordinates();
  }

  updateCoordinates(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;

    this.shipTouchArea.x = this.x - TOUCH_AREA_SIZE / 2;
    this.shipTouchArea.y = this.y - TOUCH_AREA_SIZE / 2;
  }

  listenerEvent(event, callback) {
    this.shipTouchArea.listenerEvent(event, callback);
  }

  render(context) {
    const rotation = this.rotation + Math.PI / 2;//(this.rotation * Math.PI) / 180;

    // ship painted
    const shapes = this.shipShape();/*[
      {x: -this.width / 2, y: this.height / 2},
      {x: 0, y: -this.height / 2},
      {x: this.width / 2, y: this.height / 2}
    ];*/
    const pivot = {x: this.x, y: this.y};

    for (let shape of shapes) {
      const scaleShape = 4;
      const points = shape.points.map(p => ({x: p.x * scaleShape, y: p.y * scaleShape}));
      context.beginPath();
      let position = this.getPointByVectorAndRotation(points[0], pivot, rotation);
      context.moveTo(scale(position.x), scale(position.y));
      for (let i = 1; i < points.length; i++) {
        let position = this.getPointByVectorAndRotation(points[i], pivot, rotation);
        context.lineTo(scale(position.x), scale(position.y));
      }
      context.closePath();
      context.fillStyle = shape.background;
      context.fill();
    }

    // toDo guille 27.08.21: remove this code
    // this.shipTouchArea.render(context);
  }

  shipShape() {
    return shapes;
  }

  /**
   * @param vector {{x: number, y: number}}
   * @param pivot {{x: number, y: number}}
   * @param phi {number}
   * @return {{x: number, y: number}}
   */
  getPointByVectorAndRotation(vector, pivot, phi) {
    const result = rotateVector(vector, phi);
    return {x: pivot.x + result.x, y: pivot.y - result.y};
  }

}
