import BaseObject from "../components/base-object";

export default class Scene extends BaseObject {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(eventEmitter)
    this.navigator = navigator;
    this.backgroundColor = "#f00";
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.cleanCanvas(context);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  cleanCanvas(context) {
    context.rect(0, 0, 400, 400);
    context.fillStyle = this.backgroundColor;
    context.fill();
  }
}
