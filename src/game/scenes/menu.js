import Scene from "./scene";
import Button from "../components/button";

export default class Menu extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {EventEmitter}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "BUTTON");
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);

    // toDo guille 20.08.21: render menu here
    this.button.render(context);
  }
}
