import BaseObject from "./shared/base-object";
import {EVENT_CLICK, SCREEN_HEIGHT, SCREEN_WIDTH} from "../utils/variables";
import {scale, unscale} from "../utils/helpers";
import Button from "./button";

export default class Modal extends BaseObject {
  /**
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   * @param eventEmitter {Observable}
   */
  constructor(eventEmitter, x, y, width, height) {
    super(eventEmitter, x, y, width, height);
    this.backgroundColor = "#fff";
    this.textSize = 90;
    this.text2Size = 30;
    this.text = "RECORD";
    this.score = 1000;

    const buttonHeight = 30,
      button1Width = 40,
      button2Width = 120,
      buttonMargin = 15;

    this.buttonPlay = new Button(
      eventEmitter,
      this.x + (this.width - button1Width - button2Width - buttonMargin) / 2,
      this.y + this.height - buttonHeight - buttonMargin,
      button1Width,
      buttonHeight,
      "PLAY");
    this.buttonShareRecord = new Button(
      eventEmitter,
      this.x + (this.width - button1Width - button2Width - buttonMargin) / 2 + button1Width + buttonMargin,
      this.y + this.height - buttonHeight - buttonMargin,
      button2Width,
      buttonHeight,
      "SHARE ON TWITTER"
    );
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    context.beginPath();
    context.rect(0, 0, scale(SCREEN_WIDTH), scale(SCREEN_HEIGHT));
    context.fillStyle = "rgba(0,0,0,0.82)";
    context.fill();

    context.beginPath();
    context.rect(scale(this.x), scale(this.y), scale(this.width), scale(this.height));
    context.fillStyle = this.backgroundColor;
    context.fill();

    this.buttonPlay.render(context);
    this.buttonShareRecord.render(context);

    this.renderScore(context);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  renderScore(context) {
    // toDo guille 01.09.21: refactor this code
    context.beginPath();
    context.font = `${scale(this.textSize)}px Arial`;
    const metrics = context.measureText(this.score + "");
    const textWidth = unscale(metrics.width);
    const textHeight = unscale(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
    context.fillStyle = "#000";
    context.fillText(
      this.score + "",
      scale(this.x + this.width / 2 - textWidth / 2),
      scale(this.y + this.height / 2 + textHeight / 2)
    );

    context.beginPath();
    context.font = `${scale(this.text2Size)}px Arial`;
    const metrics2 = context.measureText(this.text);
    const text2Width = unscale(metrics2.width);
    const text2Height = unscale(metrics2.actualBoundingBoxAscent + metrics2.actualBoundingBoxDescent);
    context.fillStyle = "#000";
    context.fillText(
      this.text,
      scale(this.x + this.width / 2 - text2Width / 2),
      scale(this.y + this.height / 2 + textHeight / 2 - textHeight - text2Height / 2)
    );
  }
}
