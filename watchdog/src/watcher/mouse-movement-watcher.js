import AbstractWatcher from './abstract-watcher';

class MouseMovementWatcher extends AbstractWatcher {

    /**
     * @param {Element} target
     * @param {Scenario} scenario
     * @param {int} collectInterval
     * @param {int} inactiveTimeout
     */
    constructor(target, scenario, collectInterval = 300, inactiveTimeout = 300000) {
        super(scenario, inactiveTimeout);

        this.target = target;
        this.collectInterval = collectInterval;

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
        if (!this.checkIfExpired()) {
            this.stop();
            return;
        }

        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.report('move', [event.pageX, event.pageY]);
                this.timer = null;
            }, this.collectInterval);
        }
    }

}

export default MouseMovementWatcher;