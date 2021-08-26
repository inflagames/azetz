import Scene from "./shared/scene";
import Button from "../components/button";
import {EVENT_CLICK, SCENE_FRACTAL, SCENE_GAME} from "../game";

export default class SceneMenu extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.spacing = 8;
    this.playBtn = new Button(eventEmitter, 5, 7, 100, 30, "PLAY");
    this.playBtn.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_GAME)
    );
    this.studingFractalsBtn = new Button(
      eventEmitter,
      this.playBtn.x,
      this.playBtn.y + this.playBtn.height + 2 * this.spacing,
      100,
      30,
      "STUDING FRACTALS"
    );
    this.studingFractalsBtn.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_FRACTAL)
    );
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);

    // toDo guille 20.08.21: render menu here
    this.playBtn.render(context);
    this.studingFractalsBtn.render(context);
  }
}
