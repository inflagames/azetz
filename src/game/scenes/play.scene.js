import Scene from "./shared/scene";
import Button from "../components/button";
import {
  EVENT_CLICK, EVENT_MOUSEDOWN,
  EVENT_MOUSEMOVE, EVENT_MOUSEUP,
  EVENT_TOUCHDOWN, EVENT_TOUCHMOVE,
  EVENT_TOUCHUP, SCENE_MENU,
  SCREEN_HEIGHT, SCREEN_WIDTH
} from "../game";
import Ship from "../components/ship";
import GameLogic from "./shared/game.logic";
import {scale} from "../utils/helpers";
import Score from "../components/score";
import Space from "../components/space";

export const SHIP_PADDING_Y = 80;
export const TOUCH_AREA_SIZE = 200;
const SCORE_MARGIN = 10;

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
    // space background
    this.space = new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // game logic
    this.currentGame = new GameLogic();

    // menu button
    const button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );

    // ship component
    this.ship = new Ship(eventEmitter, SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - SHIP_PADDING_Y, 30, 35);

    // ship touch area component
    this.ship.shipTouchArea.listenerEvent(EVENT_MOUSEDOWN, this.shipClickDown.bind(this));
    this.ship.shipTouchArea.listenerEvent(EVENT_TOUCHDOWN, this.shipClickDown.bind(this));

    // subscribe to scene events
    this.listenerEvent(EVENT_MOUSEUP, this.shipClickUp.bind(this));
    this.listenerEvent(EVENT_MOUSEMOVE, this.shipClickMove.bind(this));
    this.listenerEvent(EVENT_TOUCHUP, this.shipClickUp.bind(this));
    this.listenerEvent(EVENT_TOUCHMOVE, this.shipClickMove.bind(this));

    // score component
    const score = new Score(eventEmitter, SCREEN_WIDTH - SCORE_MARGIN, SCORE_MARGIN);

    // subscribe to game-logic changes
    this.currentGame.afterPlay.on(ship => {
      // update ship visual component
      this.ship.x = ship.x;
      this.ship.rotation = ship.rotation;

      // update score
      score.score = Math.floor(this.currentGame.ship.y / 50);

      // update touch
      this.ship.shipTouchArea.x = ship.x - TOUCH_AREA_SIZE / 2
    });

    // add components to the element array
    this.elements.push(this.ship);
    this.elements.push(button);
    this.elements.push(score);
  }

  shipClickUp(data) {
    if (this.shipPressed) {
      this.shipPressed = false;
      this.currentGame.launchShip(this.calculateShipRotation(data.position));
    }
  }

  shipClickDown(data) {
    if (this.currentGame.isShipClickable()) {
      this.directionToFlight = data.position;
      this.shipPressed = true;
    }
  }

  shipClickMove(data) {
    if (this.shipPressed) {
      this.directionToFlight = data.position;
    }
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    // execute game logic
    this.currentGame.play();

    // render background
    super.render(context);

    // draw ship flight line
    this.drawFlightLine(context);

    if (!this.currentGame.isFighting()) {
      this.ship.rotation = this.calculateShipRotation(this.directionToFlight);
    }

    // render scene elements
    for(let element of this.elements) {
      element.render(context);
    }
  }

  /**
   * @param position {{x: number, y: number}}
   * @returns {number}
   */
  calculateShipRotation(position) {
    return position ?
      Math.atan2((SCREEN_HEIGHT - SHIP_PADDING_Y) - position.y, position.x - this.ship.x) :
      Math.PI / 2;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  drawFlightLine(context) {
    if (this.shipPressed) {
      context.beginPath();
      context.strokeStyle = "#f00";
      context.lineWidth = 3;
      context.moveTo(scale(this.ship.x), scale(SCREEN_HEIGHT - SHIP_PADDING_Y));
      context.lineTo(scale(this.directionToFlight.x), scale(this.directionToFlight.y));
      context.stroke();
    }
  }

  cleanCanvas(context) {
    this.space.shipY = this.currentGame.ship.y;
    this.space.render(context);
  }
}
