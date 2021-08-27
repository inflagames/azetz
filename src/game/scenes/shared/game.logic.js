import {rotateVector} from "../../utils/helpers";
import {FPS, SCREEN_WIDTH} from "../../game";
import Observable from "../../utils/observable";

const SHIP_ACCELERATING = "0";
const SHIP_DECELERATING = "1";
const SHIP_STOP = "3";
const SHIP_ROTATING = "4";

const MAX_VELOCITY = 15;
const MARGIN_TO_COLLIDE = 50;
const TIME_TO_ROTATE_SHIP_MS = 400;

export default class GameLogic {
  constructor() {
    this.time = 0;
    this.ship = {
      x: SCREEN_WIDTH / 2,
      y: 0,
      rotation: Math.PI / 2,
      expectedRotation: 0,
      velocity: 0,
      acceleration: 10,
      deceleration: -2,
      status: [SHIP_STOP]
    };
    this.afterPlay = new Observable();
  }

  play() {
    this.time++;
    this.moveShip();
    this.afterPlay.emit(this.ship);
  }

  /**
   * @param rotation {number}
   */
  launchShip(rotation) {
    this.time = 0;
    this.ship.rotation = rotation;
    this.ship.status = [SHIP_ACCELERATING];
  }

  moveShip() {
    if (this.isFighting()) {
      this.wallCollision();

      this.calculateVelocity();
      this.rotateShip();
      const distance = this.ship.velocity;
      const movement = rotateVector({x: distance, y: 0}, this.ship.rotation);

      this.ship.x += movement.x;
      this.ship.y += movement.y;
    }
  }

  rotateShip() {
    if (this.shipStatus() === SHIP_ROTATING) {
      const rotationFactor = 1000 / FPS * Math.PI / TIME_TO_ROTATE_SHIP_MS;
      if (this.ship.rotation > this.ship.expectedRotation) {
        this.ship.rotation = Math.max(this.ship.rotation - rotationFactor, this.ship.expectedRotation);
      } else {
        this.ship.rotation = Math.min(this.ship.rotation + rotationFactor, this.ship.expectedRotation);
      }
      // stop rotation
      if (this.ship.rotation === this.ship.expectedRotation) {
        this.ship.status.pop();
      }
    }
  }

  calculateVelocity() {
    if (this.shipStatus() === SHIP_ROTATING) {
      return;
    }
    let velocity = 0;
    if (this.shipStatus() === SHIP_ACCELERATING) {
      velocity = this.ship.velocity + this.ship.acceleration * FPS / 1000;
      if (velocity > MAX_VELOCITY) {
        this.ship.status = [SHIP_DECELERATING];
      }
    }
    if (this.shipStatus() === SHIP_DECELERATING) {
      velocity = this.ship.velocity + this.ship.deceleration * FPS / 1000;
      if (velocity <= 0) {
        this.ship.status = [SHIP_STOP];
        velocity = 0;
      }
    }
    this.ship.velocity = velocity;
  }

  isFighting() {
    return this.shipStatus() !== SHIP_STOP;
  }

  isShipClickable() {
    return this.ship.status !== SHIP_ROTATING;
  }

  wallCollision() {
    if (this.shipStatus() !== SHIP_ROTATING &&
      this.ship.rotation > Math.PI / 2 && this.ship.x < MARGIN_TO_COLLIDE) {
      this.ship.status.push(SHIP_ROTATING);
      this.ship.expectedRotation = Math.PI - this.ship.rotation;
    }
    if (this.shipStatus() !== SHIP_ROTATING &&
      this.ship.rotation < Math.PI / 2 && this.ship.x > SCREEN_WIDTH - MARGIN_TO_COLLIDE) {
      this.ship.status.push(SHIP_ROTATING);
      this.ship.expectedRotation = Math.PI - this.ship.rotation;
    }
  }

  shipStatus() {
    return this.ship.status[this.ship.status.length - 1];
  }
}
