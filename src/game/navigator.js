import {EVENT_CLICK, SCENE_GAME, SCENE_MENU} from "./game";
import Menu from "./scenes/menu";
import Play from "./scenes/play";
import EventEmitter from "events";

export default class Navigator {
  /**
   * @param scene {number}
   * @param eventEmitter {EventEmitter}
   */
  constructor(scene, eventEmitter) {
    this.sceneClasses = new Map();
    this.sceneClasses.set(SCENE_MENU, Menu);
    this.sceneClasses.set(SCENE_GAME, Play);
    this.scenesInstances = new Map();
    /** @member {Scene} */
    this.currentScene = null;
    /** @member {EventEmitter} */
    this.subscribeToEvent(eventEmitter, EVENT_CLICK);
    this.navigate(scene);
  }

  /**
   * @param eventEmitter {EventEmitter}
   * @param event {string}
   */
  subscribeToEvent(eventEmitter, event) {
    eventEmitter.on(event, (data) => {
      if (this.currentScene) {
        this.currentScene.eventEmitter.emit(event, data);
      }
    });
  }

  /**
   * Navigate to a different scene
   * @param scene {number}
   */
  navigate(scene) {
    if (this.scenesInstances.has(scene)) {
      this.currentScene = this.scenesInstances.get(scene);
    } else if (this.sceneClasses.has(scene)) {
      this.scenesInstances.set(scene, new (this.sceneClasses.get(scene))(this, new EventEmitter()));
      this.currentScene = this.scenesInstances.get(scene);
    }
  }
}
