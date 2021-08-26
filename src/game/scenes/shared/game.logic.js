import {rotateVector} from "../../utils/helpers";
import {FPS, SCREEN_WIDTH} from "../../game";

const SHIP_ACCELERATING = "0";
const SHIP_DECELERATION = "1";
const SHIP_STOP = "3"

const MAX_VELOCITY = 10;
const MARGIN_TO_COLLIDE = 10;

export default class GameLogic {
  constructor() {
    this.time = 0;
    this.ship = {
      x: SCREEN_WIDTH / 2,
      y: 0,
      rotation: Math.PI / 2,
      velocity: 0,
      acceleration: 5,
      deceleration: -2,
      status: SHIP_STOP
    };
  }

  play() {
    this.time++;
    this.moveShip();
  }

  /**
   * @param rotation {number}
   */
  launchShip(rotation) {
    this.time = 0;
    this.ship.rotation = rotation;
    this.ship.status = SHIP_ACCELERATING;
  }

  moveShip() {
    if (this.isFighting()) {
      this.wallCollision();

      this.calculateVelocity();
      const distance = this.ship.velocity;
      const movement = rotateVector({x: distance, y: 0}, this.ship.rotation);

      this.ship.x += movement.x;
      this.ship.y += movement.y;
    }
  }

  calculateVelocity() {
    let velocity;
    if (this.ship.status === SHIP_ACCELERATING) {
      velocity = this.ship.velocity + this.ship.acceleration / FPS;
      if (velocity > MAX_VELOCITY) {
        this.ship.status = SHIP_DECELERATION;
      }
    }
    if (this.ship.status === SHIP_DECELERATION) {
      velocity = this.ship.velocity + this.ship.deceleration / FPS;
      if (velocity <= 0) {
        this.ship.status = SHIP_STOP;
        velocity = 0;
      }
    }
    this.ship.velocity = velocity;
  }

  isFighting() {
    return this.ship.status !== SHIP_STOP;
  }

  wallCollision() {
    if ((this.ship.rotation > Math.PI / 2 && this.ship.x < MARGIN_TO_COLLIDE) ||
      (this.ship.rotation < Math.PI && this.ship.x > SCREEN_WIDTH - MARGIN_TO_COLLIDE)) {
      this.ship.rotation = Math.PI - this.ship.rotation;
    }
  }
}
