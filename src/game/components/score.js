import BaseObject from "./shared/base-object";
import {scale} from "../utils/helpers";

export default class Score extends BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number} corner coordinates
   * @param y {number} corner coordinates
   */
  constructor(eventEmitter, x, y) {
    super(eventEmitter, x, y);
    this.score = 0;
    this.textSize = 30;
    this.backgroundColor = "#000";
    this.textColor = "#fff";

    this.lastTime = 0;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    context.font = `${scale(this.textSize)}px Arial`;
    const metrics = context.measureText(this.score + "");
    const textWidth = metrics.width;
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const padding = 5;

    context.beginPath();
    context.rect(
      scale(this.x - textWidth - padding * 2),
      scale(this.y),
      scale(textWidth + padding * 2),
      scale(textHeight + padding * 2)
    );
    context.fillStyle = this.backgroundColor;
    context.fill();

    context.beginPath();
    context.font = `${scale(this.textSize)}px Arial`;
    context.fillStyle = this.textColor;
    context.fillText(
      this.score + "",
      scale(this.x - textWidth - padding),
      scale(this.y + textHeight + padding)
    );
  }
}
