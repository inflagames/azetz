import Scene from "./scene";
import Button from "../components/button";
import {EVENT_CLICK, SCENE_GAME} from "../game";

export default class Menu extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "PLAY");
    this.button.listenerEvent(EVENT_CLICK, () => this.navigator.navigate(SCENE_GAME));
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
