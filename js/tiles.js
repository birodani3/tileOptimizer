var APP = APP || {};

APP.tiles = (function() {

// square 1 2  rectangle  5  rectangle 7 8  fringe -1 untouched 0
//        3 4             6

    var size;
    var TYPES = 8;
    var tiles;
    var colors = [];

    return {
        setTilesReference: setTilesReference,
        possible: possible,
        addRandomTiles: addRandomTiles,
        setTile: setTile,
        getColor: getColor
    };

    function setTilesReference(tilesRef) {
        tiles = tilesRef;
        if (size !== tiles.length) {
            size = tiles.length;
            initColorsArray();
        }
    }

    function initColorsArray() {
        colors = [];
        for (var i = 0; i < size; i++) {
            colors[i] = [];
        }
    }

    function setColor(i, j, color) {
        colors[i][j] = color;
    }

    function getColor(i, j) {
        return colors[i][j];
    }

    function possible (i, j, t) {
        switch(t) {
            case 1:
                return i+1 < tiles.length && 
                j+1 < tiles[0].length &&
                tiles[i+1][j] <=0 &&
                tiles[i][j+1] <= 0 &&
                tiles[i+1][j+1] <= 0 &&
                upperLeftOK(i,j) && lowerLeftOK(i,j+1) &&
                upperRightOK(i+1,j) && lowerRightOK(i+1,j+1);
            case 2:
                return i-1 >=0  && 
                j+1 < tiles[0].length &&
                tiles[i-1][j] <=0 &&
                tiles[i][j+1] <= 0 &&
                tiles[i-1][j+1] <= 0 &&
                upperLeftOK(i-1,j) && lowerLeftOK(i-1,j+1) &&
                upperRightOK(i,j) && lowerRightOK(i,j+1);
            case 3:
                return i+1 < tiles.length && 
                j-1 >= 0 &&
                tiles[i+1][j] <=0 &&
                tiles[i][j-1] <= 0 &&
                tiles[i+1][j-1] <= 0 &&
                upperLeftOK(i,j-1) && lowerLeftOK(i,j) &&
                upperRightOK(i+1,j-1) && lowerRightOK(i+1,j);
            case 4:
                return i-1 >=0  && 
                j-1 >= 0 &&
                tiles[i-1][j] <=0 &&
                tiles[i][j-1] <= 0 &&
                tiles[i-1][j-1] <= 0 &&
                upperLeftOK(i-1,j-1) && lowerLeftOK(i-1,j) &&
                upperRightOK(i,j-1) && lowerRightOK(i,j);
            case 5:
                return j+1 < tiles[0].length &&
                tiles[i][j+1] <= 0 &&
                upperLeftOK(i,j) && lowerLeftOK(i,j+1) &&
                upperRightOK(i,j) && lowerRightOK(i,j+1);
            case 6:
                return j-1 >= 0 &&
                tiles[i][j-1] <= 0 &&
                upperLeftOK(i,j-1) && lowerLeftOK(i,j) &&
                upperRightOK(i,j-1) && lowerRightOK(i,j);
            case 7:
                return i+1 < tiles.length && 
                tiles[i+1][j] <= 0 &&
                upperLeftOK(i,j) && lowerLeftOK(i,j) &&
                upperRightOK(i+1,j) && lowerRightOK(i+1,j);
            case 8:
                return i-1 >=0  && 
                tiles[i-1][j] <= 0 &&
                upperLeftOK(i-1,j) && lowerLeftOK(i-1,j) &&
                upperRightOK(i,j) && lowerRightOK(i,j);
        }

        return false;
    }

    function addRandomTiles(k) {
        var m = 0;
        var x = tiles.length;
        var y = tiles[0].length;

        while(m < k) {
            var i = Math.floor(Math.random() * x);
            var j = Math.floor(Math.random() * y);
            var type = Math.floor(Math.random() * 8) + 1;

            if (tiles[i][j] <= 0 && possible(i, j, type)) {	
                setTile(i,j,type);
                m++;
            }
        }

        if (k == 0) {
            if (tiles[0][0] == 0) {
                tiles[0][0] = -1;
            }
        }
    }

    function getColorTo(i, j, type) {
        var m, n, _color;

        var availableColors = [1, 2, 3, 4, 5, 6, 7];
        var toCheck = [];

        switch(type) {
            case 1:
                toCheck.push.call(toCheck, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: 0}, {x: 2, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}, {x: -1, y: 1}, {x: -1, y: 0});
                break;
            case 2:
                toCheck.push.call(toCheck, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 2}, {x: -1, y: 2}, {x: -2, y: 1}, {x: -2, y: 0});
                break;
            case 3:
                toCheck.push.call(toCheck, {x: 0, y: -2}, {x: 1, y: -2}, {x: 2, y: -1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: -1, y: -1});
                break;
            case 4:
                toCheck.push.call(toCheck, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: -2, y: 0}, {x: -2, y: -1});
                break;
            case 5:
                toCheck.push.call(toCheck, {x: 0, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 2}, {x: -1, y: 1}, {x: -1, y: 0});
                break;
            case 6:
                toCheck.push.call(toCheck, {x: 0, y: -2}, {x: 1, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: -1, y: -1});
                break;
            case 7:
                toCheck.push.call(toCheck, {x: 0, y: -1}, {x: 1, y: -1}, {x: 2, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}, {x: -1, y: 0});
                break;
            case 8:
                toCheck.push.call(toCheck, {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 1}, {x: -2, y: 0});
                break;
        }

        toCheck.forEach(function(check) {
            m = i + check.x;
            n = j + check.y;

            if (m < 0 || n < 0 || m >= tiles.length || n >= tiles[0].length) return;

            _color = getColor(m, n);

            if (_color) {
                availableColors = availableColors.filter(function(color) { 
                    return color !== _color;
                });
            }
        });

        return availableColors[0]
    }

    function setTile(i, j, t) {
        var check;

        switch (t) {
            case 1: tiles[i][j]=1;
                tiles[i+1][j]=2;
                tiles[i][j+1]=3;
                tiles[i+1][j+1]=4;
                setEdge(i,j,2,2);
                break;
            case 2: tiles[i][j]=2;
                tiles[i-1][j]=1;
                tiles[i][j+1]=4;
                tiles[i-1][j+1]=3;
                setEdge(i-1,j,2,2);
                break;
            case 3: tiles[i][j]=3;
                tiles[i+1][j]=4;
                tiles[i][j-1]=1;
                tiles[i+1][j-1]=2;
                setEdge(i,j-1,2,2);
                break;
            case 4: tiles[i][j]=4;
                tiles[i-1][j]=3;
                tiles[i][j-1]=2;
                tiles[i-1][j-1]=1;
                setEdge(i-1,j-1,2,2);
                break;
            case 5: tiles[i][j]=5;
                tiles[i][j+1]=6;
                setEdge(i,j,1,2);
                break;
            case 6: tiles[i][j]=6;
                tiles[i][j-1]=5;
                setEdge(i,j-1,1,2);
                break;
            case 7: tiles[i][j]=7;
                tiles[i+1][j]=8;
                setEdge(i,j,2,1);
                break;
            case 8: tiles[i][j]=8;
                tiles[i-1][j]=7;
                setEdge(i-1,j,2,1);
                break;
        }

        var color = getColorTo(i, j, t);

         switch (t) {
            case 1:
                setColor(i, j, color);
                setColor(i+1, j, color);
                setColor(i, j+1, color);
                setColor(i+1, j+1, color);
                break;
            case 2:
                setColor(i, j, color);
                setColor(i-1, j, color);
                setColor(i, j+1, color);
                setColor(i-1, j+1, color);
                break;
            case 3:
                setColor(i, j, color);
                setColor(i+1, j, color);
                setColor(i, j-1, color);
                setColor(i+1, j-1, color);
                break;
            case 4:
                setColor(i, j, color);
                setColor(i-1, j, color);
                setColor(i, j-1, color);
                setColor(i-1, j-1, color);
                break;
            case 5:
                setColor(i, j, color);
                setColor(i, j+1, color);
                break;
            case 6:
                setColor(i, j, color);
                setColor(i, j-1, color);
                break;
            case 7:
                setColor(i, j, color);
                setColor(i+1, j, color);
                break;
            case 8:
                setColor(i, j, color);
                setColor(i-1, j, color);
        }
    }


// ======================= private methods =======================


    function upperLeftOK(i, j) {
        return noxbreak(i - 1, j - 1) || noybreak(i - 1, j - 1);
    }

    function lowerLeftOK(i, j) {

            return noxbreak(i - 1, j + 1) || noybreak(i-1,j);
    }

    function upperRightOK(i, j) {
        return noxbreak(i,j-1) || noybreak(i+1,j-1);
    }

    function lowerRightOK(i, j) {
        return noxbreak(i,j+1) || noybreak(i+1,j);
    }

    function noxbreak(i, j) {

        return i >= tiles.length-1 || 
            j >= tiles[0].length ||
            i < 0 || 
            j < 0 ||
            tiles[i][j]==1 || 
            tiles[i][j]==3 || 
            tiles[i][j]==7 ||
            (tiles[i][j]<=0 && tiles[i+1][j]<=0);
    }

    function noybreak(i, j) {

        return i >= tiles.length || 
            j >= tiles[0].length-1 ||
            i < 0 || 
            j < 0 ||
            tiles[i][j]==1 || 
            tiles[i][j]==2 || 
            tiles[i][j]==5 ||
            (tiles[i][j]<=0 && tiles[i][j+1]<=0);
    }

    function setEdge(i, j, im, jm) {

        var imax = (i + im > tiles.length - 1 ? tiles.length - 1 : i + im);
        var jmax = (j + jm > tiles[0].length - 1 ? tiles[0].length - 1 : j + jm);
        var imin = (i - 1 < 0 ? 0 : i - 1);
        var jmin = (j - 1 < 0 ? 0 : j -1);
        var ii = i;
        var jj = j - 1;

        for(; ii <= imax; ++ii) {
            if (jj >= 0 && tiles[ii][jj] <= 0) tiles[ii][jj] = -1;
        }
        
        for(--ii, ++jj; jj <= jmax; ++jj) {
            if (ii <= imax && tiles[ii][jj] <= 0) tiles[ii][jj] = -1;
        }
        
        for(--jj, --ii; ii >= imin; --ii) {
            if (jj <= jmax && tiles[ii][jj] <= 0) tiles[ii][jj] = -1;
        }
        
        for(++ii, --jj; jj >= jmin; --jj) {
            if (ii >= 0 && tiles[ii][jj] <= 0) tiles[ii][jj] = -1;
        }
    }

})();