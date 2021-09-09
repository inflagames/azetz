import BaseShape from "./shared/base-shape";
import shape2 from "../shapes/ship2.json";
import {rotateVector} from "../utils/helpers";

export default class Ship extends BaseShape {
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
    this.rotation = Math.PI / 2;
    this.scaleShape = 4;
    this.shape = shape2;
    this.animateSmokeInterval = 0;
    this.enableSmoke = false;

    this.updateCoordinates();
  }

  updateCoordinates(x, y) {
    this.x = x || this.x;
    this.y = y || this.y;
  }

  animate() {
    super.animate();
    this.animateSmoke();
  }

  animateSmoke() {
    if (!this.brakedShape && this.enableSmoke) {
      const origins = this.shape.shapes.filter((s) => s.smoke && this.getOpacity(s.background) > 0);
      const MAX_SMOKE_ITEMS = 40;
      const MAX_NEW_SMOKE_PER_ITERATION = 1;
      const SMOKE_VELOCITY = 1;
      const SMOKE_DELAY_CREATION = 0.5;
      const SMOKE_RADIO = 1;
      const SMOKE_POINTS = 6;
      for (const origin of origins) {
        origin.points = origin.points.map((p) => ({x: p.x + origin.vector.x, y: p.y + origin.vector.y}));
        origin.background = this.reduceOpacity(origin.background, 8);
      }

      this.animateSmokeInterval++;
      if (this.animateSmokeInterval > SMOKE_DELAY_CREATION) {
        this.animateSmokeInterval = 0;
        for (let i = Math.min(MAX_SMOKE_ITEMS - origins.length, MAX_NEW_SMOKE_PER_ITERATION); i >= 0; i--) {
          const velocity = SMOKE_VELOCITY;
          const dir = rotateVector({x: -velocity, y: 0}, Math.PI * 3 / 2);
          const angle = Math.PI * 2 / SMOKE_POINTS;
          origins.unshift({
            background: "#CCCCCC64",
            vector: {x: dir.x, y: dir.y},
            smoke: true,
            points: new Array(SMOKE_POINTS).fill(0)
              .map((v, i) => rotateVector({x: SMOKE_RADIO * Math.random() + .6, y: 0}, i * angle)),
          });
        }
      }
      this.shape = {
        shapes: [...origins, ...this.shape.shapes.filter((s) => !s.smoke)],
      };
    }
  }

  shipShape() {
    return this.brakedShape || this.shape;
  }

}
