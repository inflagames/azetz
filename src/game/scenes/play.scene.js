import Scene from "./shared/scene";
import Button from "../components/button";
import {EVENT_CLICK, SCENE_MENU} from "../game";
import Ship from "../components/ship";

export default class ScenePlay extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.backgroundColor = "#0f0";
    this.backgroundColor2 = "#0ff";
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    this.button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );
    this.ship = new Ship(eventEmitter, 200, 380, 30, 35);
    this.timer = 0;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);

    // toDo guille 20.08.21: render menu here
    this.button.render(context);
    this.ship.render(context);
  }

  cleanCanvas(context) {
    // toDo 22.08.21, guille, render the background here
    const lineSize = 50;
    const velocity = 10;
    let y1 = this.timer % velocity * lineSize / velocity, counter = Math.floor(this.timer / velocity) % 2;
    this.renderBackgroundLines(context, 0, this.timer % velocity * lineSize / velocity, counter % 2 === 0 ? this.backgroundColor : this.backgroundColor2);
    counter++;
    while (true) {
      this.renderBackgroundLines(context, y1, lineSize, counter % 2 === 0 ? this.backgroundColor : this.backgroundColor2);
      y1 += lineSize;
      counter++;
      if (y1 >= 400) {
        break;
      }
    }
    // toDo 22.08.21, guille, timer in this case, is use as the distance that the ship has fighting
    // this variable should be replaced in the code, as the current Y position of the ship
    this.timer++;
  }

  renderBackgroundLines(context, y1, lineSize, color) {
    context.beginPath();
    context.rect(0, y1, 400, lineSize);
    context.fillStyle = color;
    context.fill();
  }
}
