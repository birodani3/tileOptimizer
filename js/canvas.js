var APP = APP || {};

APP.canvas = (function() {
    
    var canvas;
    var ctx;
    var tileSize = 20;
    var colors = [
        "#808080", "#FF0000", "#FFFF00", "#008000", "#00FF00",
        "#008080", "#00FFFF", "#000080"
    ];

    return {
        init: init,
        setSize: setSize,
        draw: draw,
        clear: clear,
        fade: fade
    };

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        clear();
    }

    function setSize(width, height) {
        ctx.canvas.width = width * tileSize;
        ctx.canvas.height = height * tileSize;
    }

    function draw(tiles) {
        clear();
        var posX, posY;

        tiles.forEach(function(row, i) {
            row.forEach(function(tile, j) {
                if (tile > 0) {
                    ctx.fillStyle = colors[APP.tiles.getColor(i, j)];
                    posX = i * tileSize;
                    posY = j * tileSize;

                    ctx.fillRect(posX, posY, tileSize, tileSize);
                }
            });
        });
    }

    function fade() {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function clear() {
        ctx.fillStyle = "#000000";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

})();