import Scene from "./shared/scene";
import {
  EVENT_CLICK,
  EVENT_MOUSEDOWN, EVENT_MOUSELEAVE,
  EVENT_MOUSEMOVE, EVENT_MOUSEOUT, EVENT_MOUSEUP, EVENT_TOUCHCANCEL,
  EVENT_TOUCHDOWN, EVENT_TOUCHMOVE,
  EVENT_TOUCHUP,
  SCREEN_HEIGHT, SCREEN_WIDTH
} from "../utils/variables";
import Ship from "../components/ship";
import GameLogic from "./shared/game.logic";
import {randomNumber} from "../utils/helpers";
import Score from "../components/score";
import Space from "../components/space";
import shape3 from "../shapes/ship3.json";
import shape4 from "../shapes/ship4.json";
import Meteorite from "../components/meteorite";
import Modal from "../components/modal";
import Button from "../components/button";
import Data from "../utils/data";

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
    return (
      navigator.userAgent.match(/IEMobile/i) ||
      navigator.userAgent.match(/WPDesktop/i)
    );
  },
  any: function () {
    return (
      isMobileMethod.Android() ||
      isMobileMethod.BlackBerry() ||
      isMobileMethod.iOS() ||
      isMobileMethod.Opera() ||
      isMobileMethod.Windows()
    );
  }
};
export const isMobile = isMobileMethod.any();

export const SHIP_PADDING_Y = 100;
const SCORE_MARGIN = 10;

export default class ScenePlay extends Scene {
  /**
   * @param navigator {Navigator}
   * @param eventEmitter {Observable}
   */
  constructor(navigator, eventEmitter) {
    super(navigator, eventEmitter);

    /** @member {Space[]} */
    this.spaces = [];

    this.buttonPause = new Button(this.eventEmitter, SCORE_MARGIN, SCORE_MARGIN, 60, 30, "PAUSE");
    this.buttonPause.textSize = 20;
    this.buttonPause.listenerEvent(EVENT_CLICK, () => {
      if (this.currentGame.canPauseGame()) {
        this.currentGame.pause();
        this.showModal(Data.getInstance().getScore(), false);
      }
    });

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
    // last object creation
    this.createNextObject = 0;
    this.createNextShip = 0;
    this.isModalShow = false;

    // game logic
    this.currentGame = new GameLogic();

    // space background
    this.spaces.push(new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 3, 1.1, "rgba(0,0,0,1)"));
    this.spaces.push(new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 2, 1.2));
    this.spaces.push(new Space(this.eventEmitter, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 1, 1.5));
    this.currentGame.spaces = this.spaces;

    // ship component
    this.ship = new Ship(this.eventEmitter, SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - SHIP_PADDING_Y, 30, 35);
    this.currentGame.ship.component = this.ship;

    // score component
    const score = new Score(this.eventEmitter, SCREEN_WIDTH - SCORE_MARGIN, SCORE_MARGIN);
    this.currentGame.score = score;

    // add components to the element array
    this.elements = [this.ship, this.buttonPause];
    this.elements.push(score);

    // elements of the game
    this.playableElements = [this.ship];
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
      this.showModal(this.currentGame.getScore());
    }

    // render background
    this.cleanCanvas(context);

    if (this.currentGame.isShipStopped()) {
      this.ship.rotation = this.calculateShipRotation(this.directionToFlight);
    }

    this.renderOrRemovePlayableElements(context);

    // render scene elements
    for (const element of this.elements) {
      element.render(context);
    }

    this.createEnemyByTime();
  }

  showModal(score, restartGame = true) {
    if (!this.isModalShow) {
      this.isModalShow = true;
      const modalWidth = 300;
      const modalHeight = 200;
      const modal = new Modal(
        this.eventEmitter,
        SCREEN_WIDTH / 2 - modalWidth / 2,
        SCREEN_HEIGHT / 2 - modalWidth / 2,
        modalWidth,
        modalHeight
      );
      Data.getInstance().saveScore(Math.max(Data.getInstance().getScore(), score));
      modal.score = score;
      modal.buttonPlay.listenerEvent(EVENT_MOUSEUP, () => {
        modal.buttonPlay.destroy.emit();
        modal.buttonShareRecord.destroy.emit();
        this.currentGame.unpause();
        this.elements.pop();
        this.isModalShow = false;
        if (restartGame) {
          this.initGame();
        }
      });
      this.elements.push(modal);
    }
  }

  createEnemyByTime() {
    if (this.createNextObject < this.currentGame.ship.y) {
      this.createNextObject = this.currentGame.ship.y + randomNumber(100, 200);
      this.createMeteorite();
    }
    if (this.createNextShip < this.currentGame.ship.y) {
      this.createNextShip = this.currentGame.ship.y + randomNumber(100, 200);
      this.createEnemy();
    }
  }

  createEnemy() {
    const ship = new Ship(this.eventEmitter, 0, -SCREEN_HEIGHT, 30, 35);
    // toDo guille 30.08.21: improve this
    ship.shape = randomNumber(2) ? shape3 : shape4;
    ship.rotation = (Math.PI * 3) / 2;
    this.playableElements.push(ship);
    this.currentGame.createEnemy(ship);
  }

  createMeteorite() {
    const meteorite = new Meteorite(this.eventEmitter, 0, -SCREEN_HEIGHT, 11);
    this.playableElements.push(meteorite);
    this.currentGame.createMeteorite(meteorite);
  }

  renderOrRemovePlayableElements(context) {
    const toRemove = new Set();
    for (const element of this.playableElements) {
      if (this.isElementVisible(element)) {
        element.render(context);
      } else {
        toRemove.add(element.id);
        this.currentGame.removeEnemy(element.id);
        this.currentGame.removeObject(element.id);
      }
    }
    this.playableElements = this.playableElements.filter((ele) => !toRemove.has(ele.id));
  }

  isElementVisible(element) {
    return element.y - element.height * 2 < SCREEN_HEIGHT;
  }

  /**
   * @param position {{x: number, y: number}}
   * @returns {number}
   */
  calculateShipRotation(position) {
    if (position) {
      const angle = Math.PI / 6;
      const rotation = Math.atan2((SCREEN_HEIGHT - SHIP_PADDING_Y) - position.y, position.x - this.ship.x);
      if (rotation >= 0) {
        return Math.min(Math.PI - angle, Math.max(angle, rotation));
      }
      return -rotation < Math.PI / 2 ? angle : Math.PI - angle;
    }
    return Math.PI / 2;
  }

  cleanCanvas(context) {
    this.spaces.forEach((space) => space.render(context));
  }
}
