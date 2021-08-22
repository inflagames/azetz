import Scene from "./shared/scene";
import Button from "../components/button";
import { EVENT_CLICK, SCENE_MENU } from "../game";

export default class ScenePlay extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.backgroundColor = "#0f0";
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    this.button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );
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
