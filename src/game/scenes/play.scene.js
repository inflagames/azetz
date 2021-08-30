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
import {randomNumber, scale} from "../utils/helpers";
import Score from "../components/score";
import Space from "../components/space";
import shape3 from '../shapes/ship3.json';
import shape4 from '../shapes/ship4.json';
import Meteorite from "../components/meteorite";

const isMobileMethod = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function () {
    return (isMobileMethod.Android() || isMobileMethod.BlackBerry() || isMobileMethod.iOS() || isMobileMethod.Opera() || isMobileMethod.Windows());
  }
};
export const isMobile = isMobileMethod.any();

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

    // ship touch area component
    this.listenerEvent(EVENT_MOUSEDOWN, this.shipClickDown.bind(this));
    this.listenerEvent(EVENT_TOUCHDOWN, this.shipClickDown.bind(this));

    // subscribe to scene events
    this.listenerEvent(EVENT_MOUSEUP, this.shipClickUp.bind(this));
    this.listenerEvent(EVENT_MOUSEMOVE, this.shipClickMove.bind(this));
    this.listenerEvent(EVENT_TOUCHUP, this.shipClickUp.bind(this));
    this.listenerEvent(EVENT_TOUCHMOVE, this.shipClickMove.bind(this));

    this.initGame();
  }

  initGame() {
    // space background
    // toDo guille 27.08.21: refactor this code
    this.space = new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 3);
    this.space2 = new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 2);
    this.space2.backgroundColor = null;
    this.space3 = new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 1);
    this.space3.backgroundColor = null;
    // game logic
    this.currentGame = new GameLogic();

    // menu button
    const button = new Button(this.eventEmitter, 5, 7, 100, 30, "MENU");
    button.listenerEvent(EVENT_CLICK, () =>
      this.navigator.navigate(SCENE_MENU)
    );

    // ship component
    this.ship = new Ship(this.eventEmitter, SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - SHIP_PADDING_Y, 30, 35);

    // score component
    const score = new Score(this.eventEmitter, SCREEN_WIDTH - SCORE_MARGIN, SCORE_MARGIN);

    // subscribe to game-logic after play events
    this.currentGame.afterPlay.on(ship => {
      // update score
      score.score = Math.floor(this.currentGame.ship.y / 50);

      this.space.shipY = ship.y / 1.1;
      this.space2.shipY = ship.y / 1.2;
      this.space3.shipY = ship.y / 1.5;
    });

    // add components to the element array
    this.elements = [this.ship];
    this.elements.push(button);
    this.elements.push(score);

    // elements of the game
    this.playableElements = [];

    // link components with logic
    this.currentGame.setShip(this.ship);
  }

  shipClickUp() {
    if (this.shipPressed) {
      this.shipPressed = false;
      this.currentGame.launchShip(this.calculateShipRotation(this.directionToFlight));
      if (isMobile) {
        this.directionToFlight = null;
      }
    }
  }

  shipClickDown() {
    if (this.currentGame.isShipClickable()) {
      this.shipPressed = true;
    }
  }

  shipClickMove(data) {
    this.directionToFlight = data.position;
  }

  /**
   * @param context {CanvasRenderingContext2D}
   */
  render(context) {
    // execute game logic
    this.currentGame.play();

    if (this.currentGame.isFinish()) {
      this.initGame();
      return;
    }

    // render background
    this.cleanCanvas(context);

    // draw ship flight line
    this.drawFlightLine(context);

    if (!this.currentGame.isFighting()) {
      this.ship.rotation = this.calculateShipRotation(this.directionToFlight);
    }

    // render scene elements
    for (let element of this.elements) {
      element.render(context);
    }

    this.renderOrRemovePlayableElements(context);

    this.createEnemyByTime();
  }

  createEnemyByTime() {
    const value = Math.floor(this.currentGame.ship.y / 300);
    if (value !== this.flag) {
      this.flag = value;
      this.createEnemy();
      this.createMeteorite();
    }
  }

  createEnemy() {
    const ship = new Ship(this.eventEmitter, 0, -SCREEN_HEIGHT, 30, 35);
    // toDo guille 30.08.21: improve this
    ship.shape = randomNumber(2) ? shape3 : shape4;
    ship.rotation = Math.PI * 3 / 2;
    this.playableElements.push(ship);
    this.currentGame.createEnemy(ship);
  }

  createMeteorite() {
    const meteorite = new Meteorite(this.eventEmitter, 0, -SCREEN_HEIGHT, 50);
    this.playableElements.push(meteorite);
    this.currentGame.createMeteorite(meteorite);
  }

  renderOrRemovePlayableElements(context) {
    const toRemove = new Set();
    for (let element of this.playableElements) {
      if (this.isElementVisible(element)) {
        element.render(context);
      } else {
        toRemove.add(element.id);
        this.currentGame.removeEnemy(element.id);
        this.currentGame.removeObject(element.id);
      }
    }
    this.playableElements = this.playableElements.filter(ele => !toRemove.has(ele.id));
  }

  isElementVisible(element) {
    return element.y - (element.height * 2) < SCREEN_HEIGHT;
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
    if (this.directionToFlight) {
      context.beginPath();
      context.strokeStyle = "#f00";
      context.lineWidth = 3;
      context.moveTo(scale(this.ship.x), scale(SCREEN_HEIGHT - SHIP_PADDING_Y));
      context.lineTo(scale(this.directionToFlight.x), scale(this.directionToFlight.y));
      context.stroke();
    }
  }

  cleanCanvas(context) {
    this.space.render(context);
    this.space2.render(context);
    this.space3.render(context);
  }
}
