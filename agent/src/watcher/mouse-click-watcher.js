import AbstractWatcher from './abstract-watcher';

class MouseClickWatcher extends AbstractWatcher {

    /**
     * @param {Element} target
     * @param {Scenario} scenario
     * @param {int} inactiveTimeout
     */
    constructor(target, scenario, inactiveTimeout = 300000) {
        super(scenario, inactiveTimeout);

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
        if (!this.checkIfExpired()) {
            this.stop();
            return;
        }

        this.report('click', [event.pageX, event.pageY]);
    }
}

export default MouseClickWatcher;