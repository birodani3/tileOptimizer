var APP = APP || {};

(function() {

    var tiles = [];

    $(function() {
        APP.canvas.init();

        $("#solve").click(function () {
            reset();
            solve();
        });
    });

    function solve() {
        var SIZEX = +$("#gridSizeX").val();
        var SIZEY = +$("#gridSizeY").val();
        var defaultTiles = +$("#defaultTiles").val();

        if (!validateInput(SIZEX, SIZEY, defaultTiles)) {
            return;
        }

        var tiles = createEmptyTilesArray(SIZEX, SIZEY);

        APP.tiles.setTilesReference(tiles);
        APP.canvas.setSize(SIZEX, SIZEY);
        APP.tiles.addRandomTiles(defaultTiles);

        APP.solver.solve({ x: SIZEX, y: SIZEY }, tiles, function done(state) {
            if (state === APP.runStates.DONE) {
                var elapsed = (new Date().valueOf() - startTime) / 1000;

                APP.notification.message("Solved in: " + elapsed + "secs");
            } else if (state === APP.runStates.IMPOSSIBLE) {
                APP.notification.message("Impossible to solve");
            } else {
                APP.error("An error occured");
            }
        });
    }

    function validateInput(x, y, defaultTiles) {
        if (x < 1 || y < 1 || defaultTiles < 0
         || !Number.isInteger(x)
         || !Number.isInteger(y)
         || !Number.isInteger(defaultTiles)) {
            APP.notification.message("Invalid input");
            return false;
        }

        return true;
    }

    function createEmptyTilesArray(sizex, sizey) {
        var tiles = [];

        for (var i = 0; i < sizex; i++) {
            tiles[i] = [];

            for (var j = 0; j < sizey; j++) {
                tiles[i][j] = 0;
            }
        }

        return tiles;
    }

    function reset () {
        startTime = new Date().valueOf();
        currentType = 0;
        tiles = [];
        stateStack = [];
    }

})();