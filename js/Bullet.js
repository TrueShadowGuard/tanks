import {ObjectOnMap} from "./ObjectOnMap.js";
import {DIRECTIONS} from "./Tank.js";

export class Bullet extends ObjectOnMap {
    get isFlying() { return this._isFlying }
    set isFlying(value) {
        this._isFlying = value;
        this.$element.hidden = !this.isFlying;
    }

    constructor() {
        const $button = createBulletElement();
        document.getElementById("game-map").append($button)
        super(0, 0, $button);

        this.direction = undefined;
        this.isFlying = false;
        
        window.updatableElements.push(this);
    }

    update() {
        if(!this.isFlying) return;
        switch (this.direction) {
            case DIRECTIONS.LEFT:
                this.x -= 0.2;
                break;
            case DIRECTIONS.RIGHT:
                this.x += 0.2;
                break;
            case DIRECTIONS.TOP:
                this.y -= 0.2;
                break;
            case DIRECTIONS.BOTTOM:
                this.y += 0.2;
                break;
        }
    }
}

function createBulletElement() {
    const $bullet = document.createElement("div");
    $bullet.classList.add("game-object", "game-object__bullet");
    return $bullet;
}