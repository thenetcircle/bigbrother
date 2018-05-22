import AbstractWatcher from './abstract-watcher';

class ScrollWatcher extends AbstractWatcher {

    /**
     * @param {int} collectingInterval
     */
    constructor(collectingInterval = 300) {
        super();

        this.collectingInterval = collectingInterval;
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
        if (!this.checkMaxIdleTime()) {
            this.stop();
            return;
        }

        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.report('scroll', [window.scrollX, window.scrollY]);
                this.timer = null;
            }, this.collectingInterval);
        }
    }

}

export default ScrollWatcher;