import { SCENE_MENU } from "./game";
import Menu from "./scenes/menu";

export default class Navigator {
  /**
   * @param scene {number}
   * @param eventEmitter {EventEmitter}
   */
  constructor(scene, eventEmitter) {
    this.sceneClasses = new Map();
    this.sceneClasses.set(SCENE_MENU, Menu);
    this.scenesInstances = new Map();
    /** @member {Scene} */
    this.currentScene = null;
    /** @member {EventEmitter} */
    this.eventEmitter = eventEmitter;
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
        new (this.sceneClasses.get(scene))(this, this.eventEmitter)
      );
      this.currentScene = this.scenesInstances.get(scene);
    }
  }
}
