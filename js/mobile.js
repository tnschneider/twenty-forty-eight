function detectSwipe(element, fn) {
    const H_MIN_X = 50;   // min X distance for horizontal swipe
    const H_MAX_Y = 30;   // max Y difference for horizontal swipe

    const V_MIN_Y = 50;   // min Y swipe for vertical swipe
    const V_MAX_X = 30;   // max X difference for vertical swipe

    let detect = {
        startX: null,
        startY: null,
        endX: null,
        endY: null,

        get wasSwipe() {
            return !(detect.endY === null || detect.endX === null);
        },

        get wasHorizontal() {
            return (Math.abs(detect.endX - detect.startX) > H_MIN_X)
                && (Math.abs(detect.endY - detect.startY) < H_MAX_Y);
        },

        get wasVertical() {
            return (Math.abs(detect.endY - detect.startY) > V_MIN_Y)
                && (Math.abs(detect.endX - detect.startX) < V_MAX_X);
        },
        
        get direction() {
            let direction = null;
            if (this.wasSwipe) {
                if (this.wasHorizontal) {
                    direction = (detect.endX > detect.startX) ? ACTIONS.RIGHT : ACTIONS.LEFT;
                } else if (this.wasVertical) {
                    direction = (detect.endY > detect.startY) ? ACTIONS.DOWN : ACTIONS.UP;
                }
            }
            return direction;
        },

        reset() {
            this.startX = this.startY = this.endX = this.endY = null;
        }
    };

    element.addEventListener('touchstart', function (event) {
        let touch = event.touches[0];
        detect.startX = touch.screenX;
        detect.startY = touch.screenY;
    });

    element.addEventListener('touchmove', function (event) {
        event.preventDefault();
        let touch = event.touches[0];
        detect.endX = touch.screenX;
        detect.endY = touch.screenY;
    });

    element.addEventListener('touchend', function (_) {
        let direction = detect.direction;
        
        detect.reset();

        if (direction && (typeof fn === 'function')) {
            fn(element, direction);
        } 
    });
}