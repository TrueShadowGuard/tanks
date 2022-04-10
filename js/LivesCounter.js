export class LivesCounter {
    constructor($playerLives, $enemyLives, playerLives, enemyLives, restartGame) {
        this.$playerLives = $playerLives;
        this.$enemyLives = $enemyLives;
        
        this.playerLives = playerLives;
        this.enemyLives = enemyLives;

        this.restartGame = restartGame;
    }

    set playerLives(value) {
        this._playerLives = value;
        this.$playerLives.innerText = this.playerLives;

        if(this.playerLives <= 0) {
            alert("Вы проиграли.");
            this.restartGame();
        }
    }
    get playerLives() { return this._playerLives }

    set enemyLives(value) {
        this._enemyLives = value;
        this.$enemyLives.innerText = this.enemyLives;

        if(this.enemyLives <= 0) {
            alert("Вы победили!");
            this.restartGame();
        }
    }
    get enemyLives() { return this._enemyLives }
}