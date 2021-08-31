import Scene from "./shared/scene";
import Button from "../components/button";
import {EVENT_CLICK, SCENE_GAME} from "../utils/variables";

export default class SceneMenu extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);

    const playBtn = new Button(eventEmitter, 5, 7, 100, 30, "PLAY");
    playBtn.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_GAME)
    );

    this.elements.push(playBtn);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);
  }
}
