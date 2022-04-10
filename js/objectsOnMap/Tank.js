import {ObjectOnMap} from "./ObjectOnMap.js";
import {Bullet} from "./Bullet.js";
import {rotateElement, roundTo} from "../utils.js";

export const DIRECTIONS = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    TOP: "TOP",
    BOTTOM: "BOTTOM",
}

export class Tank extends ObjectOnMap {
    constructor(x, y, $element) {
        super(x, y, $element);

        this.isMoving = false;
        this.availableDirections = {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true};

        this.bullet = new Bullet(x, y);
        window.updatableElements.push(this.bullet);
    }

    set direction(value) {
        this._direction = value;

        let rotateValue;
        switch (this.direction) {
            case DIRECTIONS.LEFT:
                rotateValue = "270deg"
                break;
            case DIRECTIONS.RIGHT:
                rotateValue = "90deg"
                break;
            case DIRECTIONS.BOTTOM:
                rotateValue = "180deg"
                break;
            case DIRECTIONS.TOP:
                rotateValue = "0deg"
                break;
        }

        rotateElement(this.$element, rotateValue);
    }

    get direction() {
        return this._direction;
    }

    update() {
        if (this.isMoving) {
            this.move()
        }
    }

    move() {
        switch (this.direction) {
            case DIRECTIONS.TOP:
                this.y -= 0.1;
                break;
            case DIRECTIONS.BOTTOM:
                this.y += 0.1;
                break;
            case DIRECTIONS.LEFT:
                this.x -= 0.1;
                break;
            case DIRECTIONS.RIGHT:
                this.x += 0.1;
                break;
        }
        this.x = roundTo(this.x, 10);
        this.y = roundTo(this.y, 10);
    }

    fire() {
        const bullet = this.bullet;
        if(bullet.isFlying) return;

        switch(this.direction) {
            case DIRECTIONS.TOP:
                bullet.y = this.y - 0.1;
                bullet.x = this.x + 0.43;
                break;
            case DIRECTIONS.BOTTOM:
                bullet.y = this.y + 1.1;
                bullet.x = this.x + 0.43;
                break;
            case DIRECTIONS.LEFT:
                bullet.y = this.y + 0.43;
                bullet.x = this.x - 0.1;
                break;
            case DIRECTIONS.RIGHT:
                bullet.y = this.y + 0.43;
                bullet.x = this.x + 1.1;
                break;
        }
        bullet.direction = this.direction;
        bullet.isFlying = true;
    }
}