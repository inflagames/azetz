import EventEmitter from "events";
import Navigator from "./navigator";

export const RUNNING = 1;
export const PAUSE = 2;
export const STOP = 3;

export const EVENT_CLICK = "0";
export const EVENT_MOUSEDOWN = "1";

export const SCENE_MENU = 0;
export const SCENE_GAME = 1; // toDo guille 20.08.21:

export const FPS = 30;
const intervalPerSecond = 1000 / FPS;

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
    /** @member {EventEmitter} */
    this.eventEmitter = new EventEmitter();
    /** @member {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext("2d");
    /** @member {Navigator} */
    this.navigatorRoot = new Navigator(SCENE_MENU, this.eventEmitter);
    this.loopStatus = STOP;
    this.lastTime = 0;
  }

  /**
   * @param event {MouseEvent}
   * @param type {string}
   */
  clickEvent(event, type) {
    const rect = this.canvas.getBoundingClientRect();
    this.eventEmitter.emit(type, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  }

  /**
   * Initialize game
   * @returns {Game}
   */
  static init() {
    const game = new Game();
    game.loopStatus = RUNNING;
    requestAnimationFrame(game.loop.bind(game));
    return game;
  }

  /**
   * Application loop
   * @param currentTime {number}
   */
  loop(currentTime) {
    switch (this.loopStatus) {
      case STOP:
        break;
      case RUNNING:
        if (intervalPerSecond <= currentTime - this.lastTime) {
          this.lastTime = currentTime;

          this.drawScreen();
        }
        break;
      case PAUSE:
        requestAnimationFrame(this.loop.bind(this));
        break;
    }
  }

  /**
   * Render the current scene
   * todo: maybe this function can be removed
   */
  drawScreen() {
    this.navigatorRoot.currentScene.render(this.context);
  }
}
