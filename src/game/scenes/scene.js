export default class Scene {

    navigator = null;
    backgroundColor = '#f00';

    /**
     * @param navigator {Navigator}
     */
    constructor(navigator) {
        this.navigator = navigator;
    }

    /**
     * @param context {CanvasRenderingContext2D}
     */
    render(context) {
        this.cleanCanvas(context);
    }

    /**
     * @param context {CanvasRenderingContext2D}
     */
    cleanCanvas(context) {
        context.rect(0, 0, 400, 400);
        context.fillStyle = this.backgroundColor;
        context.fill();
    }
}
