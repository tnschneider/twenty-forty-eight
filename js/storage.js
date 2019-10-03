class Storage {
    static get KEY() { return '_GRID_' };

    static save(grid) {
        window.localStorage.setItem(Storage.KEY, JSON.stringify(grid));
    }
    
    static clear() {
        window.localStorage.removeItem(Storage.KEY);
    }
    
    static get() {
        return JSON.parse(window.localStorage.getItem(Storage.KEY));
    }
}
