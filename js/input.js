var APP = APP || {};

APP.Input = function(x, y, defaultTiles) {
    this.x = x;
    this.y = y;
    this.defaultTiles = defaultTiles;

    this.equals = function(input) {
        return this.x === input.x && this.y === input.y && this.defaultTiles === input.defaultTiles;
    }
}