import Scene from "./scene";
import Button from "../components/button";

export default class Menu extends Scene {
  constructor() {
    super();
    this.button = new Button(5, 7, 100, 30, "BUTTON");
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
