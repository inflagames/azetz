import BaseShape from "../../src/game/components/shared/base-shape";
import Observable from "../../src/game/utils/observable";

describe("BaseShape", () => {
  it("should reduce the opacity of the color 1", () => {
    const bs = new BaseShape(new Observable());

    expect(bs.reduceOpacity("#999999", 5)).toEqual("#999999" + (250).toString(16));
  });

  it("should reduce the opacity of the color 2", () => {
    const bs = new BaseShape(new Observable());

    expect(bs.reduceOpacity("#999999fe", 5)).toEqual("#999999" + (249).toString(16));
  });

  it("should reduce the opacity of the color 3", () => {
    const bs = new BaseShape(new Observable());

    expect(bs.reduceOpacity("#99999904", 5)).toEqual("#99999900");
  });

  it("should reduce the opacity of the color 4", () => {
    const bs = new BaseShape(new Observable());

    expect(bs.reduceOpacity("#999999ff", -5)).toEqual("#999999ff");
  });
});
