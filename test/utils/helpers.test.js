import {detectCollision} from "../../src/game/utils/helpers";

describe("Helpers", () => {
  describe("Collisions", () => {
    it("should return true for a collision 1", () => {
      const shape1 = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}];
      const shape2 = [{x: 1, y: 1}, {x: 3, y: 1}, {x: 1, y: 3}];

      expect(detectCollision(shape1, shape2)).toBeTruthy();
      expect(detectCollision(shape2, shape1)).toBeTruthy();
    });

    it("should return true for a collision 2", () => {
      const shape1 = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}];
      const shape2 = [{x: 1, y: 1}, {x: 3, y: 1}, {x: 1, y: 2}];

      expect(detectCollision(shape1, shape2)).toBeTruthy();
      expect(detectCollision(shape2, shape1)).toBeTruthy();
    });

    it("should return true for a collision 3", () => {
      const shape1 = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}];
      const shape2 = [{x: 1, y: 0}, {x: 4, y: 4}, {x: -1, y: 5}];

      expect(detectCollision(shape1, shape2)).toBeTruthy();
      expect(detectCollision(shape2, shape1)).toBeTruthy();
    });

    it("should return false 1", () => {
      const shape1 = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}];
      const shape2 = [{x: 1, y: 1}, {x: 3, y: 1}, {x: 1, y: 0}];

      expect(detectCollision(shape1, shape2)).toBeFalsy();
      expect(detectCollision(shape2, shape1)).toBeFalsy();
    });

    it("should return false 2", () => {
      const shape1 = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}];
      const shape2 = [{x: 3, y: -3}, {x: 3, y: 1}, {x: 1, y: 0}];

      expect(detectCollision(shape1, shape2)).toBeFalsy();
      expect(detectCollision(shape2, shape1)).toBeFalsy();
    });

    it("should return false 3", () => {
      const shape1 = [{x: 1, y: 1}, {x: 3, y: 3}, {x: 1, y: 3}];
      const shape2 = [{x: 1, y: 1}, {x: 3, y: 1}, {x: 3, y: 1}];

      expect(detectCollision(shape1, shape2)).toBeFalsy();
      expect(detectCollision(shape2, shape1)).toBeFalsy();
    });
  });
});
