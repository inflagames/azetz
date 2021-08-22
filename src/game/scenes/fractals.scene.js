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
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    this.tree = new Rock(
      eventEmitter,
      Game.getInstance().width / 2,
      Game.getInstance().height * 0.9,
      100,
      100
    );
    this.button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);

    this.tree.render(context);

    // @todo render rock here
    this.button.render(context);
  }
}
