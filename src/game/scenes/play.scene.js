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
import TouchArea from "../components/touch-area";
import GameLogic from "./shared/game.logic";
import {scale} from "../utils/helpers";
import Score from "../components/score";
import Space from "../components/space";

const SHIP_PADDING_Y = 80;

const TOUCH_AREA_SIZE = 200;
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

    // menu button
    this.button = new Button(eventEmitter, 5, 7, 100, 30, "MENU");
    this.button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );

    // ship component
    this.ship = new Ship(eventEmitter, SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - SHIP_PADDING_Y, 30, 35);

    // ship touch area component
    this.shipTouchArea =
      new TouchArea(eventEmitter, SCREEN_WIDTH / 2 - TOUCH_AREA_SIZE / 2, SCREEN_HEIGHT - SHIP_PADDING_Y - TOUCH_AREA_SIZE / 2, TOUCH_AREA_SIZE, TOUCH_AREA_SIZE);
    this.shipTouchArea.listenerEvent(EVENT_MOUSEDOWN, this.shipClickDown.bind(this));
    this.listenerEvent(EVENT_MOUSEUP, this.shipClickUp.bind(this));
    this.listenerEvent(EVENT_MOUSEMOVE, this.shipClickMove.bind(this));
    this.shipTouchArea.listenerEvent(EVENT_TOUCHDOWN, this.shipClickDown.bind(this));
    this.listenerEvent(EVENT_TOUCHUP, this.shipClickUp.bind(this));
    this.listenerEvent(EVENT_TOUCHMOVE, this.shipClickMove.bind(this));

    // score component
    this.score = new Score(eventEmitter, SCREEN_WIDTH - SCORE_MARGIN, SCORE_MARGIN);

    // game logic
    this.currentGame = new GameLogic();

    // space background
    this.space = new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }

  shipClickUp() {
    if (this.shipPressed) {
      this.shipPressed = false;
      this.currentGame.launchShip(this.ship.rotation);
    }
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
    this.ship.rotation = Math.atan2((SCREEN_HEIGHT - SHIP_PADDING_Y) - position.y, position.x - this.ship.x);
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    this.currentGame.play();
    if (this.currentGame.isFighting()) {
      this.updateShipPosition();
      this.shipTouchArea.x = this.ship.x - TOUCH_AREA_SIZE / 2;
    }
    super.render(context);

    // toDo guille 20.08.21: render menu here
    this.ship.render(context);
    this.shipTouchArea.render(context);

    // draw ship flight line
    this.drawFlightLine(context);

    // screen elements
    this.button.render(context);

    // update score
    this.score.score = Math.floor(this.currentGame.ship.y / 50);
    this.score.render(context);
  }

  updateShipPosition() {
    this.ship.x = this.currentGame.ship.x;
    this.ship.rotation = this.currentGame.ship.rotation;
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
