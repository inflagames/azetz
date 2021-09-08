import BaseObject from "./shared/base-object";
import {scale, unscale} from "../utils/helpers";
import {EVENT_MOUSEMOVE, EVENT_MOUSEOUT} from "../utils/variables";

export default class Button extends BaseObject {
  /**
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   * @param text {string}
   * @param eventEmitter {Observable}
   */
  constructor(eventEmitter, x, y, width, height, text) {
    super(eventEmitter, x, y, width, height);
    this.text = text;
    this.textSize = 10;
    this.backgroundColor = "#000";
    this.textColor = "#fff";
    this.textColorHover = "#9a9a9a";

    this.listenerEvent(EVENT_MOUSEMOVE, (data) => {
      if (this.isPositionInside(data.position)) {
        document.body.style.cursor = "pointer";
      }
    });
    this.listenerEvent(EVENT_MOUSEOUT, (data) => {
      document.body.style.cursor = "default";
    });
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    context.beginPath();
    context.rect(scale(this.x), scale(this.y), scale(this.width), scale(this.height));
    context.fillStyle = this.backgroundColor;
    context.fill();

    context.beginPath();
    context.font = `${scale(this.textSize)}px Arial`;
    const metrics = context.measureText(this.text);
    const textWidth = unscale(metrics.width);
    const textHeight = unscale(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    context.fillStyle = this.isMouseHover ? this.textColorHover : this.textColor;
    context.text
    context.fillText(
      this.text,
      scale(this.x + this.width / 2 - textWidth / 2),
      scale(this.y + this.height / 2 + textHeight / 2)
    );
  }
}
