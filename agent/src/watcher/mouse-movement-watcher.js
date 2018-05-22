import AbstractWatcher from './abstract-watcher';
import Utils from '../utils';

class MouseMovementWatcher extends AbstractWatcher {

    /**
     * @param {Element} target
     * @param {int} collectingInterval
     */
    constructor(target, collectingInterval = 300) {
        super();

        if (!Utils.checkElement(target)) {
            throw new Error(
                'MouseMovementWatcher requires a proper target.'
            );
        }

        this.target = target;
        this.collectingInterval = collectingInterval;

        this.timer = null;
        this.run = this.run.bind(this)
    }

    start() {
        this.target.addEventListener('mousemove', this.run);
    }

    stop() {
        this.target.removeEventListener('mousemove', this.run);
    }

    run(event) {
        if (!this.checkMaxIdleTime()) {
            this.stop();
            return;
        }

        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.report('mouse.move', {'x': event.pageX, 'y': event.pageY});
                this.timer = null;
            }, this.collectingInterval);
        }
    }

}

export default MouseMovementWatcher;