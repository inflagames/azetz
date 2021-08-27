import Scene from "./shared/scene";
import Button from "../components/button";
import Game, { EVENT_CLICK, SCENE_MENU } from "../game";
import Rock from "../components/tree";

export default class SceneFractal extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.backgroundColor = "red";

    const tree = new Rock(
      this.eventEmitter,
      Game.getInstance().width / 2,
      Game.getInstance().height * 0.9,
      80,
      0,
      4,
      "black",
      "black"
    );
    const button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );

    this.elements.push(button);
    this.elements.push(tree);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);
  }
}
