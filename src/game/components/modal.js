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

    this.createCredits(this.x + buttonMargin,
      this.y,
      button1Width,
      buttonHeight);
    this.createPlayButton(this.x + (this.width - button1Width - button2Width - buttonMargin) / 2,
      this.y + this.height - buttonHeight - buttonMargin,
      button1Width,
      buttonHeight);
    this.createShareButton(this.x + (this.width - button1Width - button2Width - buttonMargin) / 2 + button1Width + buttonMargin,
      this.y + this.height - buttonHeight - buttonMargin,
      button2Width,
      buttonHeight);
  }

  createPlayButton(x, y, w, h) {
    this.buttonPlay = new Button(this.eventEmitter, x, y, w, h, "PLAY");
  }

  createCredits(x, y, w, h) {
    this.buttonCredits = new Button(this.eventEmitter, x, y, w, h, "@ggjnez92");
    this.buttonCredits.backgroundColor = "#00000000";
    this.buttonCredits.textColor = "#000";
    this.buttonCredits.textColorHover = "#0048ff";
    this.buttonCredits.listenerEvent(EVENT_CLICK, () =>
      window.open("https://twitter.com/ggjnez92", "_blank").focus());
  }

  createShareButton(x, y, w, h) {
    this.buttonShareRecord = new Button(this.eventEmitter, x, y, w, h, "SHARE ON TWITTER");
    this.buttonShareRecord.listenerEvent(EVENT_CLICK, () => {
      const message = `I%20just%20make%20a%20new%20record%20of%20${this.score}%20points%20in%20the%20%23azetz%20%23game%20developed%20for%20the%20%40js13kGames%20competition.%0A%0A%23js13k%20%23gamedev%0A%0AIf%20you%20want%20to%20check%20it%20out%2C%20here%20is%20the%20link%20to%20the%20%23github%20repository%0Ahttps%3A%2F%2Fgithub.com%2Finflagames%2Fazetz`;
      const url = `https://twitter.com/intent/tweet?text=${message}`;
      window.open(url, "_blank").focus();
    });
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
    this.buttonCredits.render(context);
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
