import BaseObject from "../../components/shared/base-object";

export default class Scene extends BaseObject {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(eventEmitter);
    this.navigator = navigator;
    this.backgroundColor = "#f00";
    /** @member {BaseObject[]} */
    this.elements = [];
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.cleanCanvas(context);
    // render scene elements
    for(let element of this.elements) {
      element.render(context);
    }
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  cleanCanvas(context) {
    context.rect(0, 0, this.width, this.height);
    context.fillStyle = this.backgroundColor;
    context.fill();
  }

  /**
   * @param position {{x: number, y: number}}
   * @param event {string}
   * @return {boolean}
   */
  validateEventPropagation(position, event) {
    const validation = super.validateEventPropagation(position, event);
    if (validation) {
      for (const e of this.elements) {
        if (e.validateEventPropagation(position, event)) {
          return false;
        }
      }
    }
    return validation;
  }
}
