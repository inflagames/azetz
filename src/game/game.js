import Navigator from "./navigator";

export const RUNNING = 1;
export const PAUSE = 2;
export const STOP = 3;

export const SCENE_MENU = 0;
export const SCENE_GAME = 1; // toDo guille 20.08.21:

export const FPS = 30;
const intervalPerSecond = 1000 / FPS;

export default class Game {

    loopStatus = STOP;
    lastTime = 0;

    /** @member {HTMLCanvasElement} */
    canvas;
    /** @member {CanvasRenderingContext2D} */
    context;

    /** @member {Navigator} */
    navigatorRoot;

    constructor() {
        this.navigatorRoot = new Navigator(SCENE_MENU);
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext("2d");
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
    };

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
            case PAUSE:
                requestAnimationFrame(this.loop.bind(this));
        }
    };

    /**
     * Render the current scene
     */
    drawScreen() {
        this.navigatorRoot.currentScene.render(this.context);
    };

}
