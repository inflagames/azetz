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

    const playBtn = new Button(eventEmitter, 5, 7, 100, 30, "PLAY");
    playBtn.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_GAME)
    );
    const studyingFractalsBtn = new Button(
      eventEmitter,
      playBtn.x,
      playBtn.y + playBtn.height + 2 * this.spacing,
      100,
      30,
      "STUDYING FRACTALS"
    );
    studyingFractalsBtn.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_FRACTAL)
    );

    this.elements.push(playBtn);
    this.elements.push(studyingFractalsBtn);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);
  }
}
