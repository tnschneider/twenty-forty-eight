class Grid {
    constructor() {
        this._initGrid(true);
    }

    reset() {
        this._initGrid(false);
    }

    handleAction(action) {
        if (this._completed) return;

        let anyMoves = this._updateGridPosition(action);

        let status = this._checkStatus();

        switch (status) {
        case STATUSES.IN_PROGRESS:
            if (anyMoves) {
                this._addNewTile();
            }
            Storage.save(this._grid);
            break;
        case STATUSES.LOST:
            this._completed = true;
            Renderer.showStatus(MESSAGES.LOST);
            Storage.clear();
            break;
        case STATUSES.WON:
            this._completed = true;
            Renderer.showStatus(MESSAGES.WON);
            Storage.clear();
            break;
        }
        
        this._render();
    }

    _initGrid(saved) {
        if (saved) {
            this._savedOrNewGrid();
        } else {
            this._newGrid();
        }

        Storage.save(this._grid);
        this._render();
        this._completed = false;
    }

    _savedOrNewGrid() {
        let savedGrid = Storage.get();

        if (savedGrid) {
            this._grid = savedGrid;
        } else {
            this._newGrid();
        }
    }

    _newGrid() {
        this._grid = [
            [{},{},{},{},],
            [{},{},{},{},],
            [{},{},{},{},],
            [{},{},{},{},],
        ];

        this._forEachCell((cell, i, j) => {
            cell.x = j;
            cell.y = i;
            cell.tile = null;
            cell.oldTile = null;
        });

        Renderer.clearTiles();

        this._addNewTile();
        this._addNewTile();
    }

    _render() {
        this._forEachCell((cell) => {
            let oldTileId = (cell.oldTile || {}).id;
            cell.oldTile = null;

            let tile = (cell.tile || {});
            let tileId = tile.id;

            if (tileId) {
                Renderer.moveTileToCell(tileId, cell.y, cell.x);
                setTimeout(() => {
                    Renderer.showTile(tileId);
                }, 100);
            }
            
            if (oldTileId) {
                Renderer.pushTileBack(tileId);
                Renderer.moveTileToCell(oldTileId, cell.y, cell.x);
                setTimeout(() => {
                    Renderer.removeTile(oldTileId);
                    if (tileId) {
                        Renderer.setTileValue(tileId, tile.value);
                    }
                }, 100);
            } else if (tileId) {
                Renderer.setTileValue(tileId, tile.value);
            }
        });
    }

    _updateGridPosition(action) {
        let anyMoves = false;
        let seq;
        for (let i = 0; i < 4; i++) {
            switch(action) {
                case ACTIONS.UP:
                seq = this._getColumn(i);
                break;
                case ACTIONS.DOWN:
                seq = this._getColumn(i, true);
                break;
                case ACTIONS.LEFT:
                seq = this._getRow(i);
                break;
                case ACTIONS.RIGHT:
                seq = this._getRow(i, true);
                break;
            }

            if (seq) {
                let moves = this._shiftSequence(seq);
                anyMoves = anyMoves || moves;
            }
        }
        return anyMoves;
    }

    _shiftSequence(seq) {
        const __getTargetCell = (seq, sourceI, sourceValue) => {
            let res = 0;
    
            for (let i = sourceI - 1; i >= 0; i--) {
                let cell = seq[i];
                if (cell.tile) {
                    if (cell.tile && cell.tile.value === sourceValue && !cell.oldTile) {
                        res = i;
                    } else {
                        res = i + 1;
                    }
                    break;
                }
            }
    
            return res === sourceI ? -1 : res;
        }

        let anyMoves = false;
        for (let i = 1; i < 4; i++) {
            let cell = seq[i];
            let tile = cell.tile;

            if (tile) {
                let target = __getTargetCell(seq, i, tile.value);
                if (target >= 0) {
                    this._moveTileFromTo(cell, seq[target]);
                    anyMoves = true;
                }
            }
        }
        return anyMoves;
    }

    _checkStatus() {
        let status = null;

        const __checkNeighbors = (i, j) => {
            let tile = this._grid[j][i].tile;
            if (!tile) return true;

            let right = (i + 1 > 3) ? null : this._grid[j][i + 1];
            if (right && (!right.tile || (right.tile || {}).value == tile.value)) return true;

            let down = (j + 1 > 3) ? null : this._grid[j + 1][i];
            if (down && (!down.tile || (down.tile || {}).value == tile.value)) return true;

            return false;
        }

        this._forEachCell((cell) => {
            if ((cell.tile || {}).value >= SCORE_TO_WIN) {
                status = STATUSES.WON;
                return false;
            }
        });

        if (status) return status;

        this._forEachCell((cell) => {
            if (cell.tile === null) {
                status = STATUSES.IN_PROGRESS;
                return false;
            }
        });

        if (status) return status;

        status = STATUSES.LOST;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (__checkNeighbors(i, j)) {
                    return STATUSES.IN_PROGRESS;
                };
            }
        }

        return status;
    }

    _addNewTile() {
        function __getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        let nEmpty = this._numEmptyCells();

        if (nEmpty === 0) return;

        let m = __getRandomInt(nEmpty);

        let tile = new Tile(Math.random() < 0.9 ? 2 : 4);

        let i = 0;
        this._forEachCell((cell) => {
            if (!cell.tile) {
                if (i === m) {
                    cell.tile = tile;
                }
                i++;
            }
        });
    }

    _moveTileFromTo(fromCell, toCell) {
        let oldCell = this._grid[fromCell.y][fromCell.x];
        
        let tile = oldCell.tile;
        
        oldCell.tile = null;

        let newCell = this._grid[toCell.y][toCell.x];

        if (newCell.tile) {
            newCell.oldTile = newCell.tile;
            tile.value *= 2;
        }

        newCell.tile = tile;
    }

    _numEmptyCells() {
        let result = 0;
        this._forEachCell((cell) => {
            if (!cell.tile) {
                result++;
            }
        });
        return result;
    }

    _forEachCell(func, r, c, reverse) {
        const __nullOrEqual = (a, b) => {
            if (a < 0) return true;
            return a === b;
        };

        const __coalesce = (x) => {
            return (x > 0 || x === 0) ? x : -1;
        }

        r = __coalesce(r);
        c = __coalesce(c);

        if (reverse) {
            for (let i = 3; i >= 0; i--) {
                for (let j = 3; j >= 0; j--) {
                    if (__nullOrEqual(r, i) && __nullOrEqual(c, j)) {
                        let cont = func(this._grid[i][j], i, j);
                        if (cont === false) return;
                    }
                }
            }
        } else {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (__nullOrEqual(r, i) && __nullOrEqual(c, j)) {
                        let cont = func(this._grid[i][j], i, j);
                        if (cont === false) return;
                    }
                }
            }
        }
    }

    _getRow(r, reverse) {
        let row = [];
        this._forEachCell((x) => row.push(x), r, null, reverse);
        return row;
    }

    _getColumn(c, reverse) {
        let col = [];
        this._forEachCell((x) => col.push(x), null, c, reverse);
        return col;
    }
}