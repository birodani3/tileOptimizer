var APP = APP || {};

APP.solver = (function() {
    var TYPES = 8;
    var currentType = 0;
    var SIZEX;
    var SIZEY;
    var tiles;    
    var stateStack = [];
    var reseting = false;

    var _callback;

    return {
        solve: solve
    };

    function reset() {
        reseting = true;
        currentType = 0;
        stateStack = [];
    }

    function solve(mapSize, inputTiles, callback) {
        reset();

        SIZEX = mapSize.x;
        SIZEY = mapSize.y;

        tiles = inputTiles;
        _callback = callback;

        APP.canvas.draw(tiles);

        requestAnimationFrame(function() {
            reseting = false;
            _solve();
        });
    }

    function _solve() {
        if (reseting) return;

        var result = step();

        if (result === APP.runStates.RUNNING) {
            requestAnimationFrame(_solve);
        } else {
            _callback && _callback(result);
        }
    }

    function step() {
        var i, j, type, count, possibleCount, bestPosition;

        count = 0;

        for (i = 0; i < tiles.length; i++) {
            for (j = 0; j < tiles[i].length; j++) {
                if (tiles[i][j] !== -1) continue;

                count++;
                possibleCount = 0;

                for (type = 1; type <= TYPES; type++) {
                    if (APP.tiles.possible(i, j, type)) {
                        possibleCount++;
                    }
                }

                if (possibleCount) {
                    if (!bestPosition || possibleCount < bestPosition.possibleCount) {
                        bestPosition = new APP.Position(i, j, possibleCount);
                    }
                } else if (stateStack.length) {
                    restoreLastState();

                    return APP.runStates.RUNNING;
                } else {
                    return APP.runStates.IMPOSSIBLE;
                }
            }
        }

        if (bestPosition) {
            for (type = 1; type <= TYPES; type++) {
                if (type <= currentType) continue;
                
                if (APP.tiles.possible(bestPosition.i, bestPosition.j, type)) {
                    saveCurrentState(tiles, type);
                    setTile(bestPosition, type);
                   
                    if (nearbyImpossible(bestPosition.i, bestPosition.j)) {
                        restoreLastState();
                        return APP.runStates.RUNNING;
                    }
                    
                    return APP.runStates.RUNNING;
                }
            }

            if (stateStack.length) {
                restoreLastState();

                return APP.runStates.RUNNING;
            }
        } else if (count == 0) {
            return APP.runStates.DONE;
        } else {
            return APP.runStates.FAILED;
        }
    }

    function nearbyImpossible(i, j) {
        var m, n, type, impossible;

        var radius = 4;

        for (var k = -radius; k <= radius; k++) {
            for (var l = -radius; l <= radius; l++) {
                if (k === 0 && l === 0) continue;

                m = i + k;
                n = j + l;

                if (m < 0 || l < 0 || m >= tiles.length || n >= tiles[0].length) continue;
                if (tiles[m][n] > 0) continue;

                impossible = true;

                for (type = 1; type <= TYPES; type++) {
                    if (APP.tiles.possible(m, n, type)) {
                        impossible = false;
                        break;
                    }
                }

                if (impossible) {
                    return true;
                }
            }
        }

        return false;
    }

    function saveCurrentState(tiles, type) {
        var state = new APP.State(tiles, type);
        stateStack.push(state);

        currentType = 0;
    }

    function restoreLastState() {
        var lastState = stateStack.pop();

        currentType = lastState.type;
        tiles = lastState.tiles;
        APP.tiles.setTilesReference(tiles);
    }

    function setTile(position, type) {
        APP.tiles.setTile(position.i, position.j, type);

        APP.canvas.draw(tiles);
    }
})()