import * as logger from "./logger";
import DOMWatcher from "./watcher/dom-watcher";
import MouseMovementWatcher from "./watcher/mouse-movement-watcher";
import MouseClickWatcher from "./watcher/mouse-click-watcher";
import MouseScrollWatcher from "./watcher/mouse-scroll-watcher";

class Scenario {

    constructor(name, buffer, context = {}) {
        this.name = name;
        this.buffer = buffer;
        this.context = context;

        this.inited = false;
        this.watchers = [];
        this.sequence = 0;
    }

    /**
     * @param  {Element} target
     * @returns {Scenario}
     */
    watchDOMChange(target) {
        if (typeof WebKitMutationObserver !== 'function') {
            logger.warn('watchDOMChange requires WebKitMutationObserver support. (which may not be supported for some browsers).');
            return this;
        }
        if (!this._checkTarget(target)) {
            logger.warn('watchDOMChange requires a proper target.');
            return this;
        }

        this.watchers.push(new DOMWatcher(target, this));
        return this;
    }

    /**
     * @returns {Scenario}
     */
    watchMouseMovement(target) {
        if (!this._checkTarget(target)) {
            logger.warn('watchMouseMovement requires a proper target.');
            return this;
        }

        this.watchers.push(new MouseMovementWatcher(target, this));
        return this;
    }

    /**
     * @returns {Scenario}
     */
    watchMouseClick(target) {
        if (!this._checkTarget(target)) {
            logger.warn('watchMouseClick requires a proper target.');
            return this;
        }

        this.watchers.push(new MouseClickWatcher(target, this));
        return this;
    }

    /**
     * @returns {Scenario}
     */
    watchMouseScroll() {
        this.watchers.push(new MouseScrollWatcher(this));
        return this;
    }

    init() {
        if (!this.inited) {

            let env = {
                "url": location.href,
                "window": this._getWindowSize(),
                "user-agent": navigator.userAgent
            };

            this.sender.send({
                i: this.sessionId,
                a: 'init',
                t: +new Date(),
                d: {
                    "userId": this._userId,
                    "url": location.href,
                    "window": this._getWindowSize(),
                    "user-agent": navigator.userAgent
                }
            }, true);

            this.inited = true;
        }
    }

    start() {
        if (this.watchers.length === 0) return;

        this.init();

        this.watchers.forEach(watcher => {
            try {
                watcher.start();
            }
            catch (e) {
                let watcherName = typeof watcher;
                logger.error(`Watcher ${watcherName} was failed to start with error ${e}`);
            }
        });
    }

    /**
     * @returns {WatchDog}
     */
    stop() {
        this.watchers.forEach(watcher => {
            try {
                watcher.stop();
            }
            catch (e) {
                let watcherName = typeof watcher;
                logger.error(`Watcher ${watcherName} was failed to stop with error ${e}`);
            }
        });
    }

    report(data) {
        this.buffer.add(data);
    }

    getBuffer() {
        return this.buffer;
    }

    getNextSequence() {
        return ++this.sequence;
    }

    static _getWindowSize() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return [x, y];
    }

    static _checkTarget(target) {
        if (typeof target !== 'object') return false;
        return true;
    }

}