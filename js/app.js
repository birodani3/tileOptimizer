var APP = APP || {};

(function() {

    var tiles = [];
    var solved = 0;
    var average = 0;
    var lastSolveInput;

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

        var input = new APP.Input(SIZEX, SIZEY, defaultTiles);

        if (!validateInput(input)) {
            return;
        }

        if (!lastSolveInput || !lastSolveInput.equals(input)) {
            lastSolveInput = new APP.Input(SIZEX, SIZEY, defaultTiles);
            solved = 0;
            average = 0;
        }

        var tiles = createEmptyTilesArray(SIZEX, SIZEY);

        APP.tiles.setTilesReference(tiles);
        APP.canvas.setSize(SIZEX, SIZEY);
        APP.tiles.addRandomTiles(defaultTiles);
        APP.solver.solve({ x: SIZEX, y: SIZEY }, tiles, function done(state) {
            if (state === APP.runStates.DONE) {
                var elapsed = (new Date().valueOf() - startTime) / 1000;
                average = ((average * solved) + elapsed) / ++solved;
                
                var averageText = (solved > 1) ? (", average: " + average.toFixed(2) + "sec after " + solved + " successful runs") : "";
                APP.notification.message("Solved in " + elapsed + "secs" + averageText);
            } else if (state === APP.runStates.IMPOSSIBLE) {
                APP.notification.message("Impossible to solve");
                APP.canvas.fade();
            } else {
                APP.error("An error occured");
            }
        });
    }

    function validateInput(input) {
        if (input.x < 1 || input.y < 1 || input.defaultTiles < 0
         || !Number.isInteger(input.x)
         || !Number.isInteger(input.y)
         || !Number.isInteger(input.defaultTiles)) {
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