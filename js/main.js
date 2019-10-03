window.onload = () => {
    let grid = new Grid();

    window.addEventListener('keydown', (e) => {
        grid.handleAction(e.key);
    });

    document.getElementById('new-game-button').addEventListener('click', () => {
        grid.reset();
    });

    detectSwipe(document.getElementById('board'), (_, action) => {
        grid.handleAction(action);
    })
}