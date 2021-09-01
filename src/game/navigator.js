import {
  EVENT_RESIZE,
  SCENE_GAME,
  SCREEN_RATIO,
  SCREEN_WIDTH,
} from "./utils/variables";
import ScenePlay from "./scenes/play.scene";
import Observable from "./utils/observable";

export default class Navigator {
  /**
   * @param scene {number}
   * @param eventEmitter {Observable}
   */
  constructor(scene, eventEmitter) {
    this.gameWidth = SCREEN_WIDTH;
    this.gameHeght = SCREEN_WIDTH * SCREEN_RATIO;
    this.sceneClasses = new Map();
    this.sceneClasses.set(SCENE_GAME, ScenePlay);
    this.scenesInstances = new Map();
    /** @member {Scene} */
    this.currentScene = null;
    eventEmitter.on((data) => {
      this.currentScene.eventEmitter.emit(data);
      if (data.event === EVENT_RESIZE && data.dimension) {
        this.gameWidth = data.dimension.w;
        this.gameHeght = data.dimension.h;
        this.updateGameDimensions();
      }
    });

    // initial navigation
    this.navigate(scene);
  }

  /**
   * Navigate to a different scene
   * @param scene {number}
   */
  navigate(scene) {
    if (this.scenesInstances.has(scene)) {
      this.currentScene = this.scenesInstances.get(scene);
    } else if (this.sceneClasses.has(scene)) {
      this.scenesInstances.set(
        scene,
        new (this.sceneClasses.get(scene))(this, new Observable())
      );
      this.currentScene = this.scenesInstances.get(scene);
    }
    this.updateGameDimensions();
  }

  updateGameDimensions() {
    if (this.currentScene) {
      this.currentScene.width = this.gameWidth;
      this.currentScene.height = this.gameHeght;
    }
  }
}
