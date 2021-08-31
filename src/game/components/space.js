import BaseObject from "./shared/base-object";
import {scale,randomNumber} from "../utils/helpers";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../utils/variables";

export class Star extends BaseObject {
  /**
   * @param evenEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param ratio {number}
   * @param groupIndex {number}
   */
  constructor(evenEmitter, x, y, ratio, groupIndex) {
    super(evenEmitter, x, y, ratio);
    this.group = groupIndex;
    this.shipY = 0;
  }

  render(context) {
    context.beginPath();
    context.fillStyle = "rgba(255,255,255,0.4)";
    context.arc(
      scale(this.x),
      scale(this.y + this.shipY - this.group * SCREEN_HEIGHT),
      scale(this.width), 0, Math.PI * 2);
    context.fill();
  }
}

export default class Space extends BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   * @param ratio {number}
   * @param velocity {number}
   * @param background {string}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0,
              ratio, velocity = 1, background = "") {
    super(eventEmitter, x, y, width, height);
    this.backgroundColor = background;
    this.shipY = 0;
    /** @member {Star[][]} */
    this.stars = [];
    this.groupCount = 0;
    this.ratio = ratio;
    this.velocity = velocity;

    // visible space
    this.generateSpace();
    // next space
    this.generateSpace();
  }

  /**
   * @param y {number}
   */
  setShipPosition(y) {
    this.shipY = y / this.velocity;
  }

  render(context) {
    if (this.backgroundColor) {
      context.beginPath();
      context.fillStyle = this.backgroundColor;
      context.rect(0, 0, scale(this.width), scale(this.height));
      context.fill();
    }

    let removeGroup = false;
    for (let i = 0; i < this.stars.length; i++) {
      let visible = false;
      this.stars[i].forEach((star) => {
        if (this.isVisibleStar(star)) {
          star.shipY = this.shipY;
          star.render(context);
          visible = true;
        }
      });
      removeGroup |= !visible && i === 0;
    }
    if (removeGroup) {
      this.stars.shift();
      this.generateSpace();
    }
  }

  generateSpace() {
    const numberOfStars = 20;
    const group = [];
    for (let i = 0; i < numberOfStars; i++) {
      group.push(new Star(this.eventEmitter, randomNumber(SCREEN_WIDTH),
        randomNumber(this.height), this.ratio, this.groupCount));
    }
    this.groupCount++;
    this.stars.push(group);
  }

  /**
   * @param star {Star}
   * @return {boolean}
   */
  isVisibleStar(star) {
    const starY = star.y + this.shipY - star.group * SCREEN_HEIGHT;
    return starY >= 0 && starY < SCREEN_HEIGHT;
  }
}
