import {CELL_SIZE} from "./main.js";
import {rotateElement, toPositionOnMap} from "./utils.js";

export const DIRECTIONS = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    TOP: "TOP",
    BOTTOM: "BOTTOM",
}

class Tank {
    constructor(x, y, $element) {
        this.isMoving = false;
        this.$element = $element;

        this.x = x;
        this.y = y;
        this.direction = DIRECTIONS.BOTTOM;
        this.availableDirections = {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true};
    }

    set x(value) {
        this._x = value;
        toPositionOnMap(this.$element, this.x, this.y);
    }

    get x() {
        return this._x;
    }

    set y(value) {
        this._y = value;
        toPositionOnMap(this.$element, this.x, this.y);
    }

    get y() {
        return this._y;
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
        const isDirectionAvailable = this.availableDirections[this.direction];
        console.log(isDirectionAvailable)
        if (!isDirectionAvailable) {
            this.direction = getRandomAvaliableDirection(this.availableDirections);
            return;
        }

        switch (this.direction) {
            case DIRECTIONS.TOP:
                this.y -= 0.5;
                break;
            case DIRECTIONS.BOTTOM:
                this.y += 0.5;
                break;
            case DIRECTIONS.LEFT:
                this.x -= 0.5;
                break;
            case DIRECTIONS.RIGHT:
                this.x += 0.5;
                break;
        }
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

export class PlayerTank extends Tank {
    constructor(x, y, $element) {
        super(x, y, $element);
    }
}

function getRandomAvaliableDirection(availableDirections) {
    const directionsArray = Object
        .entries(availableDirections)
        .filter(([dir, avaliable]) => avaliable)
        .map(([dir, avaliable]) => dir);
    return directionsArray[Math.trunc(Math.random() * directionsArray.length)];
}
