import Navigator from "./navigator";
import Observable from "./utils/observable";

export const RUNNING = 1;
export const PAUSE = 2;
export const STOP = 3;

export const EVENT_CLICK = "0";
export const EVENT_MOUSEDOWN = "1";

export const SCENE_MENU = 0;
export const SCENE_GAME = 1; // toDo guille 20.08.21:
export const SCENE_FRACTAL = 2;

export const FPS = 30;
const intervalPerSecond = 1000 / FPS;

// @member {Game}
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
    /** @member {Observable} */
    this.eventEmitter = new Observable();
    /** @member {CanvasRenderingContext2D} */
    this.context = this.canvas.getContext("2d");
    /** @member {Navigator} */
    this.navigatorRoot = new Navigator(SCENE_MENU, this.eventEmitter);
    this.loopStatus = STOP;
    this.lastTime = 0;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  /**
   * @param event {MouseEvent}
   * @param type {string}
   */
  clickEvent(event, type) {
    const rect = this.canvas.getBoundingClientRect();
    this.eventEmitter.emit({
      event: type,
      position: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
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
