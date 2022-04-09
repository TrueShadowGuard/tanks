export class Wall {
    onDestroy = undefined;

    constructor(x, y, $element) {
        this.x = x;
        this.y = y;
        this.$element = $element;
    }
    
    update() {};
    
    destroy() {
        this.$element.hidden = true;
        if(typeof this.onDestroy === "function") this.onDestroy();
    }
}
