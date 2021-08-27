import BaseObject from "./shared/base-object";

export default class Rock extends BaseObject {
  constructor(eventEmitter, x, y, len, angle, branchWidth, lineColor, fillColor) {
    super(eventEmitter, x, y);
    this.len = len;
    this.angle = angle;
    this.branchWidth = branchWidth;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
    this.wind = 0.1;
  }

  drawTree(ctx, x, y, len, angle, branchWidth, lineColor, fillColor) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = fillColor;
    ctx.line = branchWidth;
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < this.len * 0.05) {
      ctx.restore();
      return;
    }

    this.drawTree(
      ctx,
      0,
      -len,
      len * 0.75,
      angle + 10,
      branchWidth,
      lineColor,
      fillColor
    );
    this.drawTree(
      ctx,
      0,
      -len,
      len * 0.75,
      angle - 10,
      branchWidth,
      lineColor,
      fillColor
    );

    ctx.restore();
  }

  update() {
    if (this.angle >= 2 || this.angle <= -2) {
      this.wind = -this.wind;
    }
    this.angle += this.wind;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.update();

    this.drawTree(
      context,
      this.x,
      this.y,
      this.len,
      this.angle,
      this.branchWidth,
      this.lineColor,
      this.fillColor
    );
  }
}
