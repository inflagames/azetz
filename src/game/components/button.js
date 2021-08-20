export default class Button {
  /**
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   * @param text {string}
   */
  constructor(x, y, width, height, text) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
    const textWidth = context.measureText(this.text).width;
    context.font = `${this.textSize}px Arial`;
    context.fillStyle = this.textColor;
    context.fillText(
      this.text,
      (this.x + this.width) / 2 - textWidth / 2,
      this.y + this.height / 2 + this.textSize / 2
    );
  }
}
