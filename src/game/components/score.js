import BaseObject from "./shared/base-object";
import Game from "../game";
import Data from "../utils/data";

const intervalPerSecond = 1000;

export default class Score extends BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number} corner coordinates
   * @param y {number} corner coordinates
   * @param score {number}
   */
  constructor(eventEmitter, x, y) {
    super(eventEmitter, x, y);
    this.data = Data.getInstance();
    this.score = this.data.getScore();
    this.textSize = 30;
    this.backgroundColor = "#000";
    this.textColor = "#fff";

    this.lastTime = 0;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    context.font = `${this.textSize}px Arial`;
    let metrics = context.measureText(this.score + '');
    const textWidth = metrics.width;
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const padding = 5;

    context.beginPath();
    context.rect(this.x - textWidth - padding * 2, this.y, textWidth + padding * 2, textHeight + padding * 2);
    context.fillStyle = this.backgroundColor;
    context.fill();

    context.beginPath();
    context.font = `${this.textSize}px Arial`;
    context.fillStyle = this.textColor;
    context.fillText(
      this.score + '',
      this.x - textWidth - padding,
      this.y + textHeight + padding
    );

    this.calculateNextScore();
  }

  calculateNextScore() {
    const currentTime = Game.getInstance().currentTime;
    if (intervalPerSecond <= currentTime - this.lastTime) {
      this.lastTime = currentTime;
      this.score++;
      this.data.saveScore(this.score);
    }
  }
}
