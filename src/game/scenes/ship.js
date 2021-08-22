import BaseObject from "../components/base-object";

export default class Ship extends BaseObject {
  /**
   * @param eventEmitter {Observable}
   * @param x {number}
   * @param y {number}
   * @param width {number}
   * @param height {number}
   */
  constructor(eventEmitter, x = 0, y = 0, width = 0, height = 0) {
    super(eventEmitter, x, y, width, height);
    /** @member {number} */
    this.rotation = 90;
    this.backgroundColor = "#00f";
  }

  render(context) {
    const rotation = (this.rotation * Math.PI) / 180;

    // render ship body
    const leftSide = this.getPointByVectorAndRotation(
      { x: this.width / 2, y: 0 },
      {
        x: this.x,
        y: this.y,
      },
      rotation + Math.PI / 2
    );
    const rightSide = this.getPointByVectorAndRotation(
      { x: this.width / 2, y: 0 },
      {
        x: this.x,
        y: this.y,
      },
      rotation - Math.PI / 2
    );
    // noinspection JSSuspiciousNameCombination
    const frontSide = this.getPointByVectorAndRotation(
      { x: this.height, y: 0 },
      { x: this.x, y: this.y },
      rotation
    );
    context.beginPath();
    context.moveTo(leftSide.x, leftSide.y);
    context.lineTo(frontSide.x, frontSide.y);
    context.lineTo(rightSide.x, rightSide.y);
    context.closePath();
    context.fillStyle = this.backgroundColor;
    context.fill();

    // todo: test code, should be removed
    this.rotation++;
  }

  /**
   * @param vector {{x: number, y: number}}
   * @param pivot {{x: number, y: number}}
   * @param phi {number}
   * @return {{x: number, y: number}}
   */
  getPointByVectorAndRotation(vector, pivot, phi) {
    const result = this.rotateVector(vector, phi);
    return { x: pivot.x + result.x, y: pivot.y - result.y };
  }

  /**
   * @param vector {{x: number, y: number}}
   * @param phi {number}
   * @return {{x: number, y: number}}
   */
  rotateVector(vector, phi) {
    return {
      x: vector.x * Math.cos(phi) - vector.y * Math.sin(phi),
      y: vector.x * Math.sin(phi) + vector.y * Math.cos(phi),
    };
  }
}
