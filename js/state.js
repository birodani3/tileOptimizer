var APP = APP || {};

APP.State = function(tiles, type) {
    this.tiles = JSON.parse(JSON.stringify(tiles));
    this.type = type;
}