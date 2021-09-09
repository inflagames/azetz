import {detectCollision, linearFunction, randomNumber, rotateVector,} from "../../utils/helpers";
import {FPS, SCREEN_HEIGHT, SCREEN_WIDTH} from "../../utils/variables";
import {SHIP_PADDING_Y} from "../play.scene";

const SHIP_ACCELERATING = "0";
const SHIP_DECELERATING = "1";
const SHIP_STOP = "3";
const SHIP_ROTATING = "4";
const SHIP_DIE = "5";
export const SHIP_DIE_ANIMATION = "6";
const SHIP_PAUSE = "7";

const MAX_VELOCITY = 15;
const MARGIN_TO_COLLIDE = 50;
const TIME_TO_ROTATE_SHIP_MS = 400;

const MAX_DISTANCE_FOR_SHIP = 100;
const START_DISTANCE_FOR_SHIP = 200;
const MAX_DISTANCE_FOR_METEORITE = 250;
const START_DISTANCE_FOR_METEORITE = 150;
const SHIP_VELOCITY = 5;
const METEORITE_BASE_VELOCITY = 1.5;
const METEORITE_START_VELOCITY = 0.7;

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

    this.configs = {
      maxDistanceForShip: MAX_DISTANCE_FOR_SHIP,
      startDistanceForShip: START_DISTANCE_FOR_SHIP,
      maxDistanceForMeteorite: MAX_DISTANCE_FOR_METEORITE,
      startDistanceForMeteorite: START_DISTANCE_FOR_METEORITE,
      shipVelocity: SHIP_VELOCITY,
      meteoriteBaseVelocity: METEORITE_BASE_VELOCITY,
      meteoriteStartVelocity: METEORITE_START_VELOCITY,
    };
  }

  destroy() {
    this.spaces.forEach(space => space.destroy.emit());
    this.enemies.forEach(enemy => enemy.component.destroy.emit());
    this.objects.forEach(obj => obj.component.destroy.emit());
    this.ship.component.destroy.emit();
  }

  /**
   * run an iteration of the game logic
   */
  play() {
    if (this.shipStatus() === SHIP_PAUSE) {
      return;
    }
    this.animateComponents();
    if (!this.isFinish() && this.shipStatus() !== SHIP_DIE_ANIMATION) {
      this.time++;
      this.moveShip();
      this.updateComponents();
      this.updateSpaces();
      this.updateScore();
      this.checkCollision();
      this.updateGameDifficulty();
    } else if (this.shipStatus() === SHIP_DIE_ANIMATION) {
      this.time++;
      if (this.time > 20) {
        this.ship.status = [SHIP_DIE];
      }
    }
  }

  updateGameDifficulty() {
    this.configs.maxDistanceForShip = this.calculateScaleValue(MAX_DISTANCE_FOR_SHIP, 50);
    this.configs.startDistanceForShip = this.calculateScaleValue(START_DISTANCE_FOR_SHIP, 100);
    this.configs.maxDistanceForMeteorite = this.calculateScaleValue(MAX_DISTANCE_FOR_METEORITE, 150);
    this.configs.startDistanceForMeteorite = this.calculateScaleValue(START_DISTANCE_FOR_METEORITE, 50);
    this.configs.shipVelocity = this.calculateScaleValue(SHIP_VELOCITY, 7, 1);
    this.configs.meteoriteBaseVelocity = this.calculateScaleValue(METEORITE_BASE_VELOCITY, 3, 1);
    this.configs.meteoriteStartVelocity = this.calculateScaleValue(METEORITE_START_VELOCITY, 2, 1);
  }

  /**
   * @param start {number}
   * @param end {number}
   * @param sign {number}
   * @return {number}
   */
  calculateScaleValue(start, end, sign = -1) {
    return start + (Math.abs(start - end) * linearFunction(500, this.getScore()) * sign);
  }

  animateComponents() {
    // animation in general
    this.enemies.forEach((e) => e.component.animate());
    this.objects.forEach((o) => o.component.animate());
    this.ship.component.animate();
  }

  pause() {
    if (!this.isFinish() && this.canPauseGame()) {
      this.ship.status.push(SHIP_PAUSE);
    }
  }

  unpause() {
    if (this.shipStatus() === SHIP_PAUSE) {
      this.ship.status.pop();
    }
  }

  updateSpaces() {
    this.spaces.forEach((space) => space.setShipPosition(this.ship.y));
  }

  updateScore() {
    this.score.score = this.getScore();
  }

  /**
   * @return {number}
   */
  getScore() {
    return Math.floor(this.ship.y / 50);
  }

  checkCollision() {
    const shapes = this.ship.component.getProjection().filter((p) => !p.smoke);
    let component;
    for (const enemy of this.enemies) {
      const enemyShapes = enemy.component.getProjection().filter((p) => !p.smoke);
      if (this.checkCollisionInProjections(shapes, enemyShapes)) {
        this.ship.status = [SHIP_DIE_ANIMATION];
        component = enemy.component;
      }
    }
    for (const obj of this.objects) {
      const objShapes = obj.component.getProjection();
      if (this.checkCollisionInProjections(shapes, objShapes)) {
        this.ship.status = [SHIP_DIE_ANIMATION];
        component = obj.component;
      }
    }
    if (this.shipStatus() === SHIP_DIE_ANIMATION) {
      component.brakeShapes();
      this.ship.component.brakeShapes();
      this.time = 0;
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
    const xPosition = this.getRandomXPosition();
    const rotation = (Math.PI / 3) * 2 * Math.random() + Math.PI / 6 + Math.PI;
    this.enemies.push({
      x: xPosition,
      y: SCREEN_HEIGHT + this.ship.y + 100,
      rotation,
      expectedRotation: rotation,
      velocity: this.configs.shipVelocity,
      component: ship,
    });
  }

  /**
   * @param meteorite {Meteorite}
   */
  createMeteorite(meteorite) {
    const xPosition = this.getRandomXPosition();
    this.objects.push({
      x: xPosition,
      expectedX: xPosition,
      y: SCREEN_HEIGHT + this.ship.y + 100,
      velocity: this.configs.meteoriteBaseVelocity * Math.random() + this.configs.meteoriteStartVelocity,
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
      this.moveEnemy(enemy);
      enemy.component.updateCoordinates(
        enemy.x,
        SCREEN_HEIGHT - (enemy.y - this.ship.y)
      );
      enemy.component.rotation = enemy.rotation;
    });

    this.objects.forEach((obj) => {
      this.moveMeteorite(obj);
      obj.component.updateCoordinates(
        obj.x,
        SCREEN_HEIGHT - (obj.y - this.ship.y)
      );
      if (obj.expectedX === obj.x) {
        obj.expectedX = this.getRandomXPosition();
      }
    });
  }

  moveEnemy(enemy) {
    this.wallCollision(enemy);
    this.rotate(enemy);

    const movement = rotateVector({x: enemy.velocity, y: 0}, enemy.rotation);
    enemy.x += movement.x;
    enemy.y += movement.y;
  }

  moveMeteorite(obj) {
    const velocity = obj.velocity;
    let x = obj.x + (obj.x > obj.expectedX ? -velocity : obj.x < obj.expectedX ? velocity : 0);
    if ((obj.x > obj.expectedX && x < obj.expectedX) || (obj.x < obj.expectedX && x > obj.expectedX)) {
      x = obj.expectedX;
    }
    obj.x = x;
  }

  getRandomXPosition() {
    return randomNumber(SCREEN_WIDTH - SHIP_PADDING_Y, SHIP_PADDING_Y / 2);
  }

  /**
   * @param rotation {number}
   */
  launchShip(rotation) {
    this.time = 0;
    this.ship.expectedRotation = rotation;
    this.ship.status = [SHIP_ACCELERATING];
  }

  moveShip() {
    if (!this.isShipStopped()) {
      if (this.wallCollision(this.ship)) {
        this.ship.status.push(SHIP_ROTATING);
      }
      this.ship.component.enableSmoke = true;

      this.calculateVelocity();
      this.rotateShip();
      const movement = rotateVector({x: this.ship.velocity, y: 0}, this.ship.rotation);

      this.ship.x += movement.x;
      this.ship.y += movement.y;
    } else {
      this.ship.component.enableSmoke = false;
    }
  }

  rotateShip() {
    this.rotate(this.ship);
    // stop rotation
    if (this.ship.rotation === this.ship.expectedRotation && this.shipStatus() === SHIP_ROTATING) {
      this.ship.status.pop();
    }
  }

  /**
   * @param obj {{rotation: number, expectedRotation: number}}
   * @param dir {number}
   */
  rotate(obj, dir = 1) {
    const rotationFactor = ((1000 / FPS) * Math.PI) / TIME_TO_ROTATE_SHIP_MS * dir;
    if (obj.rotation > obj.expectedRotation) {
      obj.rotation = Math.max(obj.rotation - rotationFactor, obj.expectedRotation);
    } else {
      obj.rotation = Math.min(obj.rotation + rotationFactor, obj.expectedRotation);
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

  isShipStopped() {
    return this.shipStatus() === SHIP_STOP;
  }

  isFinish() {
    return this.shipStatus() === SHIP_DIE;
  }

  canPauseGame() {
    return this.notMathStatus([SHIP_DIE_ANIMATION, SHIP_DIE, SHIP_PAUSE]);
  }

  isShipClickable() {
    return this.notMathStatus([SHIP_ROTATING, SHIP_DIE, SHIP_DIE_ANIMATION, SHIP_PAUSE]);
  }

  notMathStatus(statuses) {
    return statuses.reduce(
      (prev, status) => prev && this.shipStatus() !== status,
      true
    );
  }

  /**
   * @param obj {{rotation: number, expectedRotation: number, x: number}}
   * @return {boolean}
   */
  wallCollision(obj) {
    if (
      (obj.rotation === obj.expectedRotation &&
        obj.x < MARGIN_TO_COLLIDE) ||
      (obj.rotation === obj.expectedRotation &&
        obj.x > SCREEN_WIDTH - MARGIN_TO_COLLIDE)
    ) {
      obj.expectedRotation = Math.PI - obj.rotation;
      obj.expectedRotation += obj.expectedRotation < 0 ? Math.PI * 2 : 0;
      return true;
    }
    return false;
  }

  shipStatus() {
    return this.ship.status[this.ship.status.length - 1];
  }
}
