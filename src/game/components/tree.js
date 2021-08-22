import BaseObject from "./shared/base-object";

export default class Rock extends BaseObject {
  /**
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   * @param eventEmitter {Observable}
   */
  // constructor(eventEmitter, x, y, width, height) {
  //   super(eventEmitter, x, y, width, height);
  // }

  drawTree(ctx, x, y, len, angle, branchWidth, color1, color2) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.line = branchWidth;
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
      ctx.restore();
      return;
    }

    this.drawTree(
      ctx,
      0,
      -len,
      len * 0.75,
      angle + 5,
      branchWidth,
      color1,
      color2
    );
    this.drawTree(
      ctx,
      0,
      -len,
      len * 0.75,
      angle - 5,
      branchWidth,
      color1,
      color2
    );

    ctx.restore();
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.drawTree(context, this.x, this.y, 80, 0, 4, "black", "black");
  }
}
