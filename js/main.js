import {MAP, MAP_HEIGHT, MAP_LEGEND, MAP_WIDTH} from "./map.js";
import {EnemyTank, PlayerTank} from "./Tank.js";
import {isSquareInsideSquare, toPositionOnMap} from "./utils.js";
import {Wall} from "./Wall.js";
import {LivesCounter} from "./LivesCounter.js";

export const GAME_TIMER_INTERVAL = 50; // задаёт интервал времени, за который будет выполняться один шаг в игре
export const PLAYER_LIFE_COUNT = 3;
export const ENEMY_TANKS_COUNT = 21;
export const CELL_SIZE = 64;
export const BULLET_SIZE = 8;
export const IS_GAME_OVER = false;

startGame();

function startGame() {
    document.querySelector("main").innerHTML = document.getElementById("game-template").innerHTML;

    const $playerLives = document.getElementById("player-lives");
    const $enemyLives = document.getElementById("enemy-lives")
    const intervalObject = {value: GAME_TIMER_INTERVAL};
    window.intervalObject = intervalObject;

    window.livesCounter = new LivesCounter($playerLives, $enemyLives, PLAYER_LIFE_COUNT, ENEMY_TANKS_COUNT, startGame);

    const $gameMap = document.getElementById("game-map");

    let updatableElements = [];
    let enemyTanks = [];
    let playerTank;
    let walls = [];

    window.updatableElements = updatableElements;
    window.walls = walls;
    window.enemyTanks = enemyTanks;

    gameInitialization();

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
                switch (elementName) {
                    case MAP_LEGEND.ENEMY_BASE:
                        elementModel = new EnemyTank(x, y, $element);
                        enemyTanks.push(elementModel);
                        break;
                    case MAP_LEGEND.WALL:
                        elementModel = new Wall(x, y, $element);
                        elementModel.onDestroy = () => {
                            walls = walls.filter(wall => wall !== elementModel);
                        }

                        walls.push(elementModel);
                        break;
                    case MAP_LEGEND.PLAYER_BASE:
                        elementModel = new PlayerTank(x, y, $element);
                        playerTank = elementModel;
                        window.playerTank = playerTank;
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
            }, intervalObject.value);
        }
    }
    function gameStep() {
        checkCollisions();
        updatableElements.forEach(element => element.update());
    }

    function checkCollisions() {
        const tanks = [...enemyTanks, playerTank];

        for (let tank of tanks) {
            checkTankWallsCollisions(tank);
            checkBulletWallsCollisions(tank.bullet);
        }

        checkTanksCollision(tanks);
        checkEnemyBulletsPlayerTankCollision();
        if(playerTank.bullet.isFlying) checkPlayerBulletEnemyTanksCollision();
    }

    function checkTankWallsCollisions(tank) {
        tank.availableDirections = {LEFT: true, RIGHT: true, TOP: true, BOTTOM: true};

        if (tank.x <= 0) tank.availableDirections.LEFT = false;
        if (tank.x >= MAP_WIDTH - 1) tank.availableDirections.RIGHT = false;
        if (tank.y <= 0) tank.availableDirections.TOP = false;
        if (tank.y >= MAP_HEIGHT - 1) tank.availableDirections.BOTTOM = false;

        for (let wall of walls) {
            let dx = tank.x - wall.x;
            let dy = tank.y - wall.y;
            if ((dx <= 1 && dx > 0) && Math.abs(dy) < 1) {
                tank.availableDirections.LEFT = false;
            }
            if ((dx >= -1 && dx < 0) && Math.abs(dy) < 1) {
                tank.availableDirections.RIGHT = false;
            }
            if ((dy <= 1 && dy > 0) && Math.abs(dx) < 1) {
                tank.availableDirections.TOP = false;
            }
            if ((dy >= -1 && dy < 0) && Math.abs(dx) < 1) {
                tank.availableDirections.BOTTOM = false;
            }
        }
    }
    function checkTanksCollision(tanks) {
        for(let tank1 of tanks) {
            for(let tank2 of tanks) {
                if(tank1 === tank2) continue;

                let dx = tank1.x - tank2.x;
                let dy = tank1.y - tank2.y;
                if ((dx <= 1 && dx > 0) && Math.abs(dy) < 1) {
                    tank1.availableDirections.LEFT = false;
                    tank2.availableDirections.RIGHT = false;
                }
                if ((dx >= -1 && dx < 0) && Math.abs(dy) < 1) {
                    tank1.availableDirections.RIGHT = false;
                    tank2.availableDirections.LEFT = false;
                }
                if ((dy <= 1 && dy > 0) && Math.abs(dx) < 1) {
                    tank1.availableDirections.TOP = false;
                    tank2.availableDirections.BOTTOM = false;
                }
                if ((dy >= -1 && dy < 0) && Math.abs(dx) < 1) {
                    tank1.availableDirections.BOTTOM = false;
                    tank2.availableDirections.TOP = false;
                }
            }
        }
    }
    function checkBulletWallsCollisions(bullet) {
        const isBulletOutsideMap = bullet.x > MAP_WIDTH || bullet.x < 0 || bullet.y < 0 || bullet.y > MAP_HEIGHT;
        if(isBulletOutsideMap) {
            bullet.isFlying = false;
            return;
        }

        for(let wall of walls) {
            if(isSquareInsideSquare(wall.x, wall.y, CELL_SIZE, bullet.x, bullet.y, BULLET_SIZE)) {
                wall.destroy();
                bullet.isFlying = false;
            }
        }
    }
    function checkPlayerBulletEnemyTanksCollision() {
        for(let enemyTank of enemyTanks) {
            if(isSquareInsideSquare(enemyTank.x, enemyTank.y, CELL_SIZE, playerTank.bullet.x, playerTank.bullet.y, BULLET_SIZE)) {
                enemyTank.kill();
                playerTank.bullet.isFlying = false;
            }
        }
    }
    function checkEnemyBulletsPlayerTankCollision() {
        for(let enemyTank of enemyTanks) {
            if(isSquareInsideSquare(playerTank.x, playerTank.y, CELL_SIZE, enemyTank.bullet.x, enemyTank.bullet.y, BULLET_SIZE)) {
                playerTank.kill();
                enemyTank.bullet.isFlying = false;
            }
        }
    }
}

