import BaseObject from "./shared/base-object";
import {rotateVector, scale} from "../utils/helpers";
import TouchArea from "./touch-area";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../game";
import {SHIP_PADDING_Y, TOUCH_AREA_SIZE} from "../scenes/play.scene";

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
  }

  render(context) {
    const rotation = this.rotation + Math.PI / 2;//(this.rotation * Math.PI) / 180;

    // render ship body
    const leftSide = this.getPointByVectorAndRotation(
      {x: -this.width / 2, y: this.height / 2},
      {
        x: this.x,
        y: this.y,
      },
      rotation
    );
    const rightSide = this.getPointByVectorAndRotation(
      {x: this.width / 2, y: this.height / 2},
      {
        x: this.x,
        y: this.y,
      },
      rotation
    );
    const frontSide = this.getPointByVectorAndRotation(
      {x: 0, y: -this.height / 2},
      {x: this.x, y: this.y},
      rotation
    );
    context.beginPath();
    context.moveTo(scale(leftSide.x), scale(leftSide.y));
    context.lineTo(scale(frontSide.x), scale(frontSide.y));
    context.lineTo(scale(rightSide.x), scale(rightSide.y));
    context.closePath();
    context.fillStyle = this.backgroundColor;
    context.fill();

    this.shipTouchArea.render(context);
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
