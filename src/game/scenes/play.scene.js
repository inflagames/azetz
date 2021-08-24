import Scene from "./shared/scene";
import Button from "../components/button";
import {
  EVENT_CLICK,
  EVENT_MOUSEDOWN,
  EVENT_MOUSEMOVE,
  EVENT_MOUSEUP,
  EVENT_TOUCHDOWN, EVENT_TOUCHMOVE,
  EVENT_TOUCHUP,
  SCENE_MENU
} from "../game";
import Ship from "../components/ship";
import TouchArea from "../components/touch-area";

export default class ScenePlay extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);
    this.x = 0;
    this.y = 0;
    this.width = 400;
    this.height = 400;
    this.backgroundColor = "#0f0";
    this.backgroundColor2 = "#0ff";
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    this.button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );
    this.ship = new Ship(eventEmitter, 200, 380, 30, 35);
    const touchArea = 200;
    this.shipTouchArea = new TouchArea(eventEmitter, 200 - touchArea / 2, 380 - touchArea, touchArea, touchArea);
    this.shipTouchArea.listenerEvent(EVENT_MOUSEDOWN, this.shipClickDown.bind(this));
    this.listenerEvent(EVENT_MOUSEUP, () => this.shipPressed = false);
    this.listenerEvent(EVENT_MOUSEMOVE, this.shipClickMove.bind(this));
    this.shipTouchArea.listenerEvent(EVENT_TOUCHDOWN, this.shipClickDown.bind(this));
    this.listenerEvent(EVENT_TOUCHUP, () => {this.shipPressed = false});
    this.listenerEvent(EVENT_TOUCHMOVE, this.shipClickMove.bind(this));
    this.timer = 0;
  }

  shipClickDown(data) {
    this.directionToFlight = data.position;
    this.shipPressed = true;
  }

  shipClickMove(data) {
    if (this.shipPressed) {
      this.directionToFlight = data.position;
      this.calculateShipRotation(data.position);
    }
  }

  calculateShipRotation(position) {
    this.ship.rotation = Math.atan2(380 - position.y, position.x - 200);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    super.render(context);

    // toDo guille 20.08.21: render menu here
    this.button.render(context);
    this.ship.render(context);
    this.shipTouchArea.render(context);

    // draw ship flight line
    this.drawFlightLine(context);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  drawFlightLine(context) {
    if (this.shipPressed) {
      context.beginPath();
      context.strokeStyle = "#f00";
      context.lineWidth = 3;
      context.moveTo(200, 380);
      context.lineTo(this.directionToFlight.x, this.directionToFlight.y);
      context.stroke();
    }
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
