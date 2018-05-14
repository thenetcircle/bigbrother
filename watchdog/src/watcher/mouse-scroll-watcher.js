import AbstractWatcher from './abstract-watcher';

class MouseScrollWatcher extends AbstractWatcher {

    /**
     * @param {Scenario} scenario
     * @param {int} collectInterval
     * @param {int} inactiveTimeout
     */
    constructor(scenario, collectInterval = 300, inactiveTimeout = 300000) {
        super(scenario, inactiveTimeout);

        this.collectInterval = collectInterval;
        this.timer = null;
        this.run = this.run.bind(this)
    }

    start() {
        window.addEventListener('scroll', this.run);
    }

    stop() {
        window.removeEventListener('scroll', this.run);
    }

    run(event) {
        if (!this.checkIfExpired()) {
            this.stop();
            return;
        }

        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.report('scroll', [window.scrollX, window.scrollY]);
                this.timer = null;
            }, this.collectInterval);
        }
    }

}

export default MouseScrollWatcher;