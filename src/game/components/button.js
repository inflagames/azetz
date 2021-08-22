import BaseObject from "./shared/base-object";

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
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = this.backgroundColor;
    context.fill();

    context.beginPath();
    context.font = `${this.textSize}px Arial`;
    let metrics = context.measureText(this.text);
    const textWidth = metrics.width;
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    context.fillStyle = this.textColor;
    context.fillText(
      this.text,
      this.x + this.width / 2 - textWidth / 2,
      this.y + this.height / 2 + textHeight / 2
    );
  }
}
