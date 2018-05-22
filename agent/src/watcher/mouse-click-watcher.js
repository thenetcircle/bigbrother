import AbstractWatcher from './abstract-watcher';
import Utils from '../utils';

class MouseClickWatcher extends AbstractWatcher {

    /**
     * @param {Element} target
     */
    constructor(target) {
        super();

        if (!Utils.checkElement(target)) {
            throw new Error(
                'MouseClickWatcher requires a proper target.'
            );
        }

        this.target = target;
        this.run = this.run.bind(this)
    }

    start() {
        this.target.addEventListener('click', this.run);
    }

    stop() {
        this.target.removeEventListener('click', this.run);
    }

    run(event) {
        if (!this.checkMaxIdleTime()) {
            this.stop();
            return;
        }

        this.report('click', [event.pageX, event.pageY]);
    }
}

export default MouseClickWatcher;