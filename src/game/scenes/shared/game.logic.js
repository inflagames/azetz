import {detectCollision, randomNumber, rotateVector,} from "../../utils/helpers";
import {FPS, SCREEN_HEIGHT, SCREEN_WIDTH} from "../../utils/variables";
import {SHIP_PADDING_Y} from "../play.scene";

const SHIP_ACCELERATING = "0";
const SHIP_DECELERATING = "1";
const SHIP_STOP = "3";
const SHIP_ROTATING = "4";
const SHIP_DIE = "5";

const MAX_VELOCITY = 15;
const MARGIN_TO_COLLIDE = 50;
const TIME_TO_ROTATE_SHIP_MS = 400;

const ME_ROTATION = Math.PI / 80;

export default class GameLogic {
  constructor() {
    /** @member {Score} */
    this.score = null;
    /** @member {Space[]} */
    this.spaces = [];
    this.time = 0;

    this.ship = {
      x: SCREEN_WIDTH / 2,
      y: 0,
      rotation: Math.PI / 2,
      expectedRotation: 0,
      velocity: 0,
      minVelocity: 10,
      acceleration: 20,
      deceleration: -1.5,
      status: [SHIP_STOP],
      component: undefined,
    };
    this.enemies = [];
    this.objects = [];
  }

  /**
   * run an iteration of the game logic
   */
  play() {
    if (this.ship.status !== SHIP_DIE) {
      this.time++;
      this.moveShip();
      this.updateComponents();
      this.updateSpaces();
      this.updateScore();
      this.checkCollision();
    }
  }

  updateSpaces() {
    this.spaces.forEach((space) => space.setShipPosition(this.ship.y));
  }

  updateScore() {
    this.score.score = Math.floor(this.ship.y / 50);
  }

  checkCollision() {
    const shapes = this.ship.component.getProjection();
    for (const enemy of this.enemies) {
      const enemyShapes = enemy.component.getProjection();
      if (this.checkCollisionInProjections(shapes, enemyShapes)) {
        this.ship.status = SHIP_DIE;
      }
    }
    for (const obj of this.objects) {
      const objShapes = obj.component.getProjection();
      if (this.checkCollisionInProjections(shapes, objShapes)) {
        this.ship.status = SHIP_DIE;
      }
    }
  }

  /**
   * @param shapes1 {{points: {x: number, y: number}[], background: string}[]}
   * @param shapes2 {{points: {x: number, y: number}[], background: string}[]}
   * @return {boolean}
   */
  checkCollisionInProjections(shapes1, shapes2) {
    for (const s1 of shapes1) {
      for (const s2 of shapes2) {
        if (detectCollision(s1.points, s2.points)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @param ship {Ship}
   */
  createEnemy(ship) {
    const xPosition = randomNumber(
      SCREEN_WIDTH - SHIP_PADDING_Y * 2,
      SHIP_PADDING_Y
    );
    this.enemies.push({
      x: xPosition,
      y: SCREEN_HEIGHT + this.ship.y + 100,
      rotation: (Math.PI * 3) / 2,
      component: ship,
    });
  }

  /**
   * @param meteorite {Meteorite}
   */
  createMeteorite(meteorite) {
    const xPosition = randomNumber(
      SCREEN_WIDTH - SHIP_PADDING_Y * 2,
      SHIP_PADDING_Y
    );
    this.objects.push({
      x: xPosition,
      y: SCREEN_HEIGHT + this.ship.y + 100,
      rotation: 0,
      component: meteorite,
    });
  }

  /**
   * @param id {number}
   */
  removeObject(id) {
    this.objects = this.objects.filter((obj) => obj.component.id !== id);
  }

  /**
   * @param id {number}
   */
  removeEnemy(id) {
    this.enemies = this.enemies.filter((enemy) => enemy.component.id !== id);
  }

  /**
   * Update visual components in relation with the game logic
   */
  updateComponents() {
    // update ship visual component
    this.ship.component.updateCoordinates(this.ship.x);
    this.ship.component.rotation = this.ship.rotation;

    this.enemies.forEach((enemy) => {
      enemy.component.updateCoordinates(
        enemy.x,
        SCREEN_HEIGHT - (enemy.y - this.ship.y)
      );
      enemy.component.rotation = enemy.rotation;
    });

    this.objects.forEach((obj) => {
      obj.component.updateCoordinates(
        obj.x,
        SCREEN_HEIGHT - (obj.y - this.ship.y)
      );
      obj.component.rotation += ME_ROTATION;
    });
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
      const rotationFactor = ((1000 / FPS) * Math.PI) / TIME_TO_ROTATE_SHIP_MS;
      if (this.ship.rotation > this.ship.expectedRotation) {
        this.ship.rotation = Math.max(
          this.ship.rotation - rotationFactor,
          this.ship.expectedRotation
        );
      } else {
        this.ship.rotation = Math.min(
          this.ship.rotation + rotationFactor,
          this.ship.expectedRotation
        );
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
      velocity = this.ship.velocity + (this.ship.acceleration * FPS) / 1000;
      if (velocity > MAX_VELOCITY) {
        this.ship.status = [SHIP_DECELERATING];
      }
    }
    if (this.shipStatus() === SHIP_DECELERATING) {
      velocity = this.ship.velocity + (this.ship.deceleration * FPS) / 1000;
      velocity = Math.max(velocity, this.ship.minVelocity);
    }
    this.ship.velocity = velocity;
  }

  isFighting() {
    return this.shipStatus() !== SHIP_STOP;
  }

  isFinish() {
    return this.shipStatus() === SHIP_DIE;
  }

  isShipClickable() {
    return this.ship.status !== SHIP_ROTATING;
  }

  wallCollision() {
    if (
      this.shipStatus() !== SHIP_ROTATING &&
      this.ship.rotation > Math.PI / 2 &&
      this.ship.x < MARGIN_TO_COLLIDE
    ) {
      this.ship.status.push(SHIP_ROTATING);
      this.ship.expectedRotation = Math.PI - this.ship.rotation;
    }
    if (
      this.shipStatus() !== SHIP_ROTATING &&
      this.ship.rotation < Math.PI / 2 &&
      this.ship.x > SCREEN_WIDTH - MARGIN_TO_COLLIDE
    ) {
      this.ship.status.push(SHIP_ROTATING);
      this.ship.expectedRotation = Math.PI - this.ship.rotation;
    }
  }

  shipStatus() {
    return this.ship.status[this.ship.status.length - 1];
  }
}
