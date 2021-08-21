import { SCENE_GAME, SCENE_MENU } from "./game";
import Menu from "./scenes/menu";
import Play from "./scenes/play";
import Observable from "./utils/observable";

export default class Navigator {
  /**
   * @param scene {number}
   * @param eventEmitter {Observable}
   */
  constructor(scene, eventEmitter) {
    this.sceneClasses = new Map();
    this.sceneClasses.set(SCENE_MENU, Menu);
    this.sceneClasses.set(SCENE_GAME, Play);
    this.scenesInstances = new Map();
    /** @member {Scene} */
    this.currentScene = null;
    eventEmitter.on((data) => {
      this.currentScene.eventEmitter.emit(data);
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
  }
}
