import {MAP, MAP_LEGEND} from "./map.js";
import {EnemyTank, PlayerTank} from "./Tank.js";
import {toPositionOnMap} from "./utils.js";
import {Wall} from "./Wall.js";

export const GAME_TIMER_INTERVAL = 300; // задаёт интервал времени, за который будет выполняться один шаг в игре
export const PLAYER_LIFE_COUNT = 3;
export const ENEMY_TANKS_COUNT = 21;
export const CELL_SIZE = 64;
export const IS_GAME_OVER = false;

const $gameMap = document.getElementById("game-map");

let updatableElements = [];
let enemyTanks = [];
let playerTank;

let walls = [];

window.updatableElements = updatableElements;
window.walls = walls;
window.enemyTanks = enemyTanks;

gameInitialization();


/**
 * Жизненный цикл игры
 * вызывает функцию gameLoop каждые GAME_TIMER_INTERVAL до тех пор, пока игра не закончится
 * (чтобы закончить игру, установите занчение переменной IS_GAME_OVER в true)
 */
gameLoop();


function gameInitialization() {
    initMap();
}

function initMap() {
    const elements = {
        [MAP_LEGEND.PLAYER_BASE]: (x, y) => {
            const $playerTank = document.createElement("div");
            $playerTank.className = "game-object game-object__player-tank";
            toPositionOnMap($playerTank, x, y);
            return $playerTank;
        },
        [MAP_LEGEND.ENEMY_BASE]: (x, y) => {
            const $enemyTank = document.createElement("div");
            $enemyTank.className = "game-object game-object__enemy-tank";
            toPositionOnMap($enemyTank, x, y);
            return $enemyTank;
        },
        [MAP_LEGEND.WALL]: (x, y) => {
            const $wall = document.createElement("div");
            $wall.className = "game-object game-object__wall";
            toPositionOnMap($wall, x, y);
            return $wall;
        }
    };
    MAP.forEach((row, y) => {
        row.forEach((elementName, x) => {
            if (!elements[elementName]) return;

            const $element = elements[elementName](x, y);
            $gameMap.append($element);
            
            let elementModel;
            switch(elementName) {
                case MAP_LEGEND.ENEMY_BASE:
                    elementModel = new EnemyTank(x, y, $element);
                    enemyTanks.push(elementModel);
                    break;
                case MAP_LEGEND.WALL:
                    elementModel = new Wall(x, y, $element);
                    walls.push(elementModel);
                    break;
                case MAP_LEGEND.PLAYER_BASE:
                    elementModel = new PlayerTank(x, y, $element);
                    playerTank = elementModel;
            }
            updatableElements.push(elementModel);
        });
    });
}

function gameLoop() {
    if (IS_GAME_OVER !== true) {

        /**
         * вот именно в функции gameStep стоит разместить код, который будет выполняться на каждом шаге игрового цикла
         */
        gameStep();


        setTimeout(function () {
            gameLoop()
        }, GAME_TIMER_INTERVAL);
    }
}

function gameStep() {
    /**
     * это то самое место, где стоит делать основные шаги игрового цикла
     * например, как нам кажется, можно было бы сделать следующее
     * 1. передвинуть пули
     * 2. рассчитать, где танки окажутся после этого шага
     * 3. проверить столкновения (пуль с танками, пуль со стенами, танков со стенами и танков с танками)
     * 4. убрать с поля мертвые танки и разрушенные стены
     * 5. проверить, не закончились ли жизни у игрока или не закончиличь ли танки противника
     * 6. создать новые танки на базах в случае, если кого-то убили на этом шаге
     */
    checkForCollisions();
    updatableElements.forEach(element => element.update());
}

function checkForCollisions() {
    for(let tank of enemyTanks) {
        tank.availableDirections = {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true};
        if(tank.x === 0) tank.availableDirections.LEFT = false;
        if(tank.x === 12) tank.availableDirections.RIGHT = false;
        if(tank.y === 0) tank.availableDirections.TOP = false;
        if(tank.y === 13) tank.availableDirections.BOTTOM = false;
        
        for(let wall of walls) {
            if(wall.x + 1 === tank.x && wall.y === tank.y) {
                tank.availableDirections.LEFT = false;
            }
            if(wall.x - 1 === tank.x && wall.y === tank.y) {
                tank.availableDirections.RIGHT = false;
            }
            if(wall.y + 1 === tank.y && wall.x === tank.x) {
                tank.availableDirections.TOP = false;
            }
            if(wall.y - 1 === tank.y && wall.x === tank.x) {
                tank.availableDirections.BOTTOM = false;
            }
        }
    }
}

