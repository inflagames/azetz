import {SCENE_MENU} from "./game";
import Menu from "./scenes/menu";


export default class Navigator {

    scenesInstances = new Map();
    sceneClasses = new Map();

    /** @member {Scene} */
    currentScene;

    /**
     * @param scene {number}
     */
    constructor(scene) {
        this.sceneClasses.set(SCENE_MENU, Menu);

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
            this.scenesInstances.set(scene, new (this.sceneClasses.get(scene)));
            this.currentScene = this.scenesInstances.get(scene);
        }
    }
}
