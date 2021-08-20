export default class Scene {
  /**
   * @param navigator {Navigator}
   */
  constructor(navigator) {
    this.navigator = navigator;
    this.navigator = null;
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
