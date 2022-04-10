import {DIRECTIONS, Tank} from "./Tank.js";
import {getRandomAvaliableDirection} from "../utils.js";

export class EnemyTank extends Tank {
    constructor(x, y, $element) {
        super(x, y, $element);
        this.baseX = x;
        this.baseY = y;
        this.isMoving = true;
        this.direction = DIRECTIONS.BOTTOM;
    }

    update() {
        super.update();
        if(!this.bullet.isFlying) this.fire();
    }

    move() {
        const isDirectionAvailable = this.availableDirections[this.direction];
        if (!isDirectionAvailable) {
            this.direction = getRandomAvaliableDirection(this.availableDirections);
            return;
        }
        super.move();
    }

    kill() {
        this.x = this.baseX;
        this.y = this.baseY;
        this.direction = getRandomAvaliableDirection(DIRECTIONS);
        window.livesCounter.enemyLives--;
    }
}