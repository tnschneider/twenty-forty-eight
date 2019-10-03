const ACTIONS = {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight'
};

const STATUSES = {
    WON: 'WON',
    LOST: 'LOST',
    IN_PROGRESS: 'IN_PROGRESS'
};

const MESSAGES = {
    WON: 'You won :)',
    LOST: 'You lost :(',
}

const SCORE_TO_WIN = 2048;

const COLORS = {
    2:          ['#DEEDCF', 'black'],
    4:          ['#BFE1B0', 'black'],
    8:          ['#99D492', 'black'],
    16:         ['#74C67A', 'black'],
    32:         ['#56B870', 'white'],
    64:         ['#39A96B', 'white'],
    128:        ['#1D9A6C', 'white'],
    256:        ['#198F74', 'white'],
    512:        ['#16837A', 'white'],
    1024:       ['#137177', 'white'],
    2048:       ['#0F596B', 'white'],
    4096:       ['#0D425E', 'white'],
    8192:       ['#0A2F51', 'white'],
    default:    ['#0A2F51', 'white']
}