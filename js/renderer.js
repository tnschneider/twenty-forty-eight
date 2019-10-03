class Renderer {
    static moveTileToCell(index, row, cell) {
        let el = Renderer._getTile(index);
        let { x, y } = Renderer._getCellPosition(row, cell);

        if (!el) {
            let newEl = document.createElement('div');

            newEl.classList = 'tile';
            newEl.id = `tile${index}`;
            newEl.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
            newEl.style.zIndex = '100';
            newEl.style.opacity = 0;

            Renderer._getBoard().appendChild(newEl);
        } else {
            el.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
        }
    }

    static removeTile(index) {
        let el = Renderer._getTile(index);
        el.parentElement.removeChild(el);
    }

    static setTileValue(index, value) {
        let el = Renderer._getTile(index);
        let colors = Renderer._getColors(value);

        el.style.backgroundColor = colors[0];
        el.style.color = colors[1];
        el.innerText = value;
    }

    static pushTileBack(index) {
        let el = Renderer._getTile(index);
        el.style.zIndex = '50';
    }

    static showTile(index) {
        let el = Renderer._getTile(index);
        el.style.opacity = 1;
    }

    static showStatus(message) {
        let el = document.getElementById('status-indicator');
        el.innerText = message || '';
        el.style.opacity = (message || {}).length > 0 ? 0.5 : 0;
    }

    static clearTiles() {
        Renderer.showStatus();

        Array.from(document.getElementsByClassName('tile')).forEach((tile) => {
            tile.parentElement.removeChild(tile);
        });
    }

    static get _cellWidth() {
        if (typeof Renderer.__cellWidth === 'undefined') {
            var el = Renderer._getBoard();
            Renderer.__cellWidth = el.offsetWidth / 4;
        }

        return Renderer.__cellWidth;
    }

    static _getCellPosition(row, cell) {
        let cellWidth = Renderer._cellWidth;

        let y = row * cellWidth;
        let x = cell * cellWidth;

        return { x, y };
    }

    static _getBoard() {
        return document.getElementById('board');
    }

    static _getTile(index) {
        return document.getElementById(`tile${index}`);
    }

    static _getColors(value) {
        return COLORS[value] || COLORS.default;
    }
}