import Navigator from "./navigator";
import Observable from "./utils/observable";

export const RUNNING = 1;
export const PAUSE = 2;
export const STOP = 3;

export const EVENT_CLICK = "0";
export const EVENT_MOUSEDOWN = "1";
export const EVENT_MOUSEUP = "2";
export const EVENT_MOUSEMOVE = "3";
export const EVENT_MOUSEOUT = "8";
export const EVENT_MOUSELEAVE = "9";
export const EVENT_TOUCHDOWN = "4";
export const EVENT_TOUCHUP = "5";
export const EVENT_TOUCHMOVE = "6";
export const EVENT_TOUCHCANCEL = "7";

export const SCENE_MENU = 0;
export const SCENE_GAME = 1; // toDo guille 20.08.21:
export const SCENE_FRACTAL = 2;

export const FPS = 30;
const intervalPerSecond = 1000 / FPS;

let gameInstance = null;

export default class Game {
  constructor() {
    /** @member {HTMLCanvasElement} */
    this.canvas = document.getElementById("game");
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
    this.canvas.addEventListener("touchstart", (e) =>
      this.touchEvent(e, EVENT_TOUCHDOWN), false
    );
    this.canvas.addEventListener("touchend", (e) =>
      this.touchEvent(e, EVENT_TOUCHUP), false
    );
    this.canvas.addEventListener("touchcancel", (e) =>
      this.touchEvent(e, EVENT_TOUCHCANCEL), false
    );
    this.canvas.addEventListener("touchmove", (e) =>
      this.touchEvent(e, EVENT_TOUCHMOVE), false
    );
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
  }

  /**
   * @param event {TouchEvent}
   * @param type {string}
   */
  touchEvent(event, type) {
    console.log(type)
    this.emitPositionEvent({
      x: event?.targetTouches[0]?.pageX,
      y: event?.targetTouches[0]?.pageY,
    }, type);
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
        x: position.x - rect.left,
        y: position.y - rect.top,
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
