import {rotateVector} from "../../utils/helpers";

export default class GameLogic {
  constructor() {
    this.time = 0;
    this.ship = {x: 200, y: 0, rotation: Math.PI / 2, velocity: 0};
  }

  play() {
    this.time++;
    this.moveShip();
  }

  /**
   * @param rotation {number}
   */
  launchShip(rotation) {
    this.ship.rotation = rotation;
    this.ship.velocity = 10;
  }

  moveShip() {
    if (this.isFighting()) {
      this.wallCollision();

      const distance = this.ship.velocity;
      const movement = rotateVector({x: distance, y: 0}, this.ship.rotation);

      this.ship.x += movement.x;
      this.ship.y += movement.y;
    }
  }

  isFighting() {
    return this.ship.velocity > 0;
  }

  wallCollision() {
    if (this.ship.rotation > Math.PI / 2 && this.ship.x < 10) {
      this.ship.rotation = Math.PI - this.ship.rotation;
    }
    if (this.ship.rotation < Math.PI && this.ship.x > 390) {
      this.ship.rotation = Math.PI - this.ship.rotation;
    }
  }
}
