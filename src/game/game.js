import Navigator from "./navigator";
import Observable from "./utils/observable";
import { unscale } from "./utils/helpers";
import {
  SCREEN_WIDTH,
  SCREEN_RATIO,
  SCENE_GAME,
  STOP,
  EVENT_CLICK,
  EVENT_MOUSEDOWN,
  EVENT_MOUSEUP,
  EVENT_MOUSEOUT,
  EVENT_MOUSELEAVE,
  EVENT_MOUSEMOVE,
  EVENT_TOUCHDOWN,
  EVENT_TOUCHUP,
  EVENT_TOUCHCANCEL,
  EVENT_TOUCHMOVE,
  EVENT_RESIZE,
  RUNNING,
  FPS,
} from "./utils/variables";

const intervalPerSecond = 1000 / FPS;

let gameInstance = null;

export default class Game {
  constructor() {
    window.addEventListener("resize", this.resizeScreen.bind(this));

    /** @member {HTMLCanvasElement} */
    this.canvas = document.getElementById("game");

    this.registerEvents();

    /** @member {Observable} */
    this.eventEmitter = new Observable();

    /** @member {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext("2d");

    /** @member {Navigator} */
    this.navigatorRoot = new Navigator(SCENE_GAME, this.eventEmitter);

    this.loopStatus = STOP;
    this.lastTime = 0;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.resizeScreen();
  }

  registerEvents() {
    this.canvas.addEventListener("click", (e) =>
      this.clickEvent(e, EVENT_CLICK)
    );
    this.canvas.addEventListener("mousedown", (e) =>
      this.clickEvent(e, EVENT_MOUSEDOWN)
    );
    this.canvas.addEventListener("mouseup", (e) =>
      this.clickEvent(e, EVENT_MOUSEUP)
    );
    this.canvas.addEventListener("mouseout", (e) =>
      this.clickEvent(e, EVENT_MOUSEOUT)
    );
    this.canvas.addEventListener("mouseleave", (e) =>
      this.clickEvent(e, EVENT_MOUSELEAVE)
    );
    this.canvas.addEventListener("mousemove", (e) =>
      this.clickEvent(e, EVENT_MOUSEMOVE)
    );
    this.canvas.addEventListener(
      "touchstart",
      (e) => this.touchEvent(e, EVENT_TOUCHDOWN),
      false
    );
    this.canvas.addEventListener(
      "touchend",
      (e) => this.touchEvent(e, EVENT_TOUCHUP),
      false
    );
    this.canvas.addEventListener(
      "touchcancel",
      (e) => this.touchEvent(e, EVENT_TOUCHCANCEL),
      false
    );
    this.canvas.addEventListener(
      "touchmove",
      (e) => this.touchEvent(e, EVENT_TOUCHMOVE),
      false
    );
  }

  resizeScreen() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let calculatedWidth = Math.min(SCREEN_WIDTH, width);
    let calculatedHeight = calculatedWidth * SCREEN_RATIO;

    if (calculatedHeight > height) {
      calculatedHeight = height;
      calculatedWidth = height / SCREEN_RATIO;
    }

    this.canvas.width = calculatedWidth;
    this.canvas.height = calculatedHeight;

    window.currentWidth = calculatedWidth;
    this.eventEmitter.emit({
      event: EVENT_RESIZE,
      dimension: { w: calculatedWidth, h: calculatedHeight },
    });
  }

  /**
   * @param event {TouchEvent}
   * @param type {string}
   */
  touchEvent(event, type) {
    this.emitPositionEvent(
      {
        x: event?.targetTouches[0]?.pageX,
        y: event?.targetTouches[0]?.pageY,
      },
      type
    );
  }

  /**
   * @param event {MouseEvent}
   * @param type {string}
   */
  clickEvent(event, type) {
    this.emitPositionEvent({ x: event?.clientX, y: event?.clientY }, type);
  }

  /**
   * @param position {{x: number, y: number}}
   */
  emitPositionEvent(position, type) {
    const rect = this.canvas.getBoundingClientRect();
    this.eventEmitter.emit({
      event: type,
      position: {
        x: unscale(position.x - rect.left),
        y: unscale(position.y - rect.top),
      },
    });
  }

  /**
   * Get game instance
   * @returns {Game}
   */
  static getInstance() {
    if (!gameInstance) {
      gameInstance = new Game();
    }
    return gameInstance;
  }

  /**
   * Initialize game
   */
  init() {
    this.loopStatus = RUNNING;
    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Application loop
   * @param currentTime {number}
   */
  loop(currentTime) {
    if (this.loopStatus === RUNNING) {
      this.currentTime = currentTime;
      if (
        this.loopStatus === RUNNING &&
        intervalPerSecond <= currentTime - this.lastTime
      ) {
        this.lastTime = currentTime;

        this.drawScreen();
      }

      requestAnimationFrame(this.loop.bind(this));
    }
    // the else here will end the loop
  }

  /**
   * Render the current scene
   * todo: maybe this function can be removed
   */
  drawScreen() {
    this.navigatorRoot.currentScene.render(this.context);
  }
}
