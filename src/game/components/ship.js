import BaseShape from "./shared/base-shape";
import shape2 from "../shapes/ship2.json";

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
    if (!this.brakedShape) {
      this.animateSmokeInterval++;
      if (this.animateSmokeInterval < 2) {
        return;
      }
      this.animateSmokeInterval = 0;
      const origins = this.shape.filter((s) => !!s.origin && this.getOpacity(s.background) > 0);
      const MAX_SMOKE_ITEMS = 100;
      const MAX_NEW_SMOKE_PER_ITERATION = 3;
      for (const origin of origins) {
        origin.points = origin.points.map((p) => ({x: p.x + origin.vector.x, y: p.y + origin.vector.y}));
        origin.background = this.reduceOpacity(origin.background, 30);
      }
      for (let i = Math.min(MAX_SMOKE_ITEMS - origins.length, MAX_NEW_SMOKE_PER_ITERATION); i >= 0; i--) {
        origins.push({
          background: "#cccccc",
          vector: {x: 1, y: i-1},
          origin: {},
          points: [
            {
              x: 0,
              y: 2,
            },
            {
              x: 0,
              y: 0,
            },
            {
              x: 0,
              y: 2,
            },
            {
              x: 2,
              y: 2,
            },
          ],
        });
      }
      this.shape = [...this.shape.filter((s) => !s.origin), ...origins];
    }
  }

  shipShape() {
    return this.brakedShape || this.shape;
  }

}
