import {DIRECTIONS, Tank} from "./Tank.js";

export class PlayerTank extends Tank {
    constructor(x, y, $element) {
        super(x, y, $element);
        this.baseX = x;
        this.baseY = y;
        this.direction = DIRECTIONS.TOP;
        this.baseDirection = this.direction;

        this.pressedKeys = {ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false};

        document.addEventListener("keydown", this.onKeyDown);
        document.addEventListener("keyup", this.onKeyUp);
    }

    onKeyDown = e => {
        this.isMoving = true;
        switch(e.code) {
            case "ArrowUp": this.direction = DIRECTIONS.TOP; this.pressedKeys.ArrowUp = true; break;
            case "ArrowDown": this.direction = DIRECTIONS.BOTTOM; this.pressedKeys.ArrowDown = true; break;
            case "ArrowLeft": this.direction = DIRECTIONS.LEFT; this.pressedKeys.ArrowLeft = true; break;
            case "ArrowRight": this.direction = DIRECTIONS.RIGHT; this.pressedKeys.ArrowRight = true; break;
            case "Space": this.fire();
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

    kill() {
        this.x = this.baseX;
        this.y = this.baseY;
        this.direction = this.baseDirection;
        window.livesCounter.playerLives--;
    }
}
