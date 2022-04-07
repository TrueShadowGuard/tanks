import {CELL_SIZE} from "./main.js";
import {toPositionOnMap} from "./utils.js";

const DIRECTIONS = {
    LEFT: 0,
    RIGHT: 1,
    TOP: 2,
    BOTTOM: 3,
}

class Tank {
    constructor(x, y, $element) {
        this._x = x;
        this._y = y;
        this.direction = "bottom";
        this.isMoving = false;
        this.$element = $element;
    }

    set x(value) {
        this._x = value;
        toPositionOnMap(this.$element, this.x, this.y);
    }

    get x() {
        return this._x;
    }

    set y(value) {
        this._y= value;
        toPositionOnMap(this.$element, this.x, this.y);
    }

    get y() {
        return this._y;
    }

    update() {
        if(this.isMoving) {
            this.move()
        }
    }

    move() {
        this.y += 0.1;
    }

    fire() {

    }
}

export class EnemyTank extends Tank {
    constructor(x, y, $element) {
        super(x, y, $element);
        this.isMoving = true;
    }
}