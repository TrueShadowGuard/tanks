import {CELL_SIZE} from "./main.js";
import {rotateElement, roundTo, toPositionOnMap} from "./utils.js";

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

    }
}

export class EnemyTank extends Tank {
    constructor(x, y, $element) {
        super(x, y, $element);
        this.isMoving = true;
    }

    move() {
        const isDirectionAvailable = this.availableDirections[this.direction];
        if (!isDirectionAvailable) {
            this.direction = getRandomAvaliableDirection(this.availableDirections);
            return;
        }
        super.move();
    }
}

export class PlayerTank extends Tank {
    constructor(x, y, $element) {
        super(x, y, $element);
        this.pressedKeys = {ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false};

        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
    }

    onKeyDown = e => {
        this.isMoving = true;
        switch(e.key) {
            case "ArrowUp": this.direction = DIRECTIONS.TOP; this.pressedKeys.ArrowUp = true; break;
            case "ArrowDown": this.direction = DIRECTIONS.BOTTOM; this.pressedKeys.ArrowDown = true; break;
            case "ArrowLeft": this.direction = DIRECTIONS.LEFT; this.pressedKeys.ArrowLeft = true; break;
            case "ArrowRight": this.direction = DIRECTIONS.RIGHT; this.pressedKeys.ArrowRight = true; break;
        }
    }

    onKeyUp = e => {
        switch(e.key) {
            case "ArrowUp": this.pressedKeys.ArrowUp = false; break;
            case "ArrowDown": this.pressedKeys.ArrowDown = false; break;
            case "ArrowLeft": this.pressedKeys.ArrowLeft = false; break;
            case "ArrowRight": this.pressedKeys.ArrowRight = false; break;
        }
    }

    move() {
        if(Object.entries(this.pressedKeys).every(([key, pressed]) => !pressed)) return;

        const isDirectionAvailable = this.availableDirections[this.direction];
        if (!isDirectionAvailable) {
            return;
        }
        super.move();
    }
}

function getRandomAvaliableDirection(availableDirections) {
    const directionsArray = Object
        .entries(availableDirections)
        .filter(([dir, avaliable]) => avaliable)
        .map(([dir, avaliable]) => dir);
    return directionsArray[Math.trunc(Math.random() * directionsArray.length)];
}
