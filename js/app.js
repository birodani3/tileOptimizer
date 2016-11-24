var APP = APP || {};

(function() {

    var startTime;
    var currentType = 0;
    var TYPES = 8;
    var SIZEX;
    var SIZEY;
    var defaultTiles;
    var tiles = [];

    var stateStack = [];
    var typeStack = [];

    $(function() {
        APP.canvas.init();

        addEventListeners();
    });

    function addEventListeners() {
        $("#solve").click(function () {
            reset();

            SIZEX = $("#gridSizeX").val();
            SIZEY = $("#gridSizeY").val();
            defaultTiles = $("#defaultTiles").val();

            if (!SIZEX || !SIZEY || !defaultTiles) {
                return;
            }

            initTilesArray();
            APP.tiles.setTilesReference(tiles);
            APP.canvas.setSize(SIZEX, SIZEY);
            APP.tiles.addRandomTiles(defaultTiles);

            solve();
        });
    }

    function solve() {
        var result = step();

        if (result === APP.runStates.RUNNING) {
            requestAnimationFrame(solve);
        } else if (result === APP.runStates.DONE) {
            var elapsed = (new Date().valueOf() - startTime) / 1000;

            APP.notification.message("Solved in: " + elapsed + "secs");
        } else if (result === APP.runStates.IMPOSSIBLE) {
            APP.notification.message("Impossible to solve");
        } else if (result === APP.runStates.FAILED) {
            APP.error("An error occured");
        }
    }

    function initTilesArray() {
        for (var i = 0; i < SIZEX; i++) {
            tiles[i] = [];

            for (var j = 0; j < SIZEY; j++) {
                tiles[i][j] = 0;
            }
        }
    }

    function step() {
        var i, j, type, count, state;

        count = 0;

        for (i = 0; i < tiles.length; i++) {
            for (j = 0; j < tiles[i].length; j++) {
                if (tiles[i][j] != -1) continue;

                count++;

                for (type = 1; type <= TYPES; type++) {
                    if (type <= currentType) continue;
                    
                    if (APP.tiles.possible(i, j, type)) {
                        state = new APP.State(tiles, type);
                        stateStack.push(state);

                        currentType = 0;

                        APP.tiles.setTile(i, j, type);
                        APP.canvas.draw(tiles);
                        
                        return APP.runStates.RUNNING;
                    }
                }
                
                if (stateStack.length) {
                    var lastState = stateStack.pop();

                    currentType = lastState.type;
                    tiles = lastState.tiles;
                    APP.tiles.setTilesReference(tiles);

                    return APP.runStates.RUNNING;
                }
                
                return APP.runStates.IMPOSSIBLE;
            }
        }
        
        if (count == 0) {
            return APP.runStates.DONE;
        }
        
        return APP.runStates.FAILED;
    }

    function reset () {
        startTime = new Date().valueOf();
        currentType = 0;
        tiles = [];
        stateStack = [];
        typeStack = [];
    }

})();