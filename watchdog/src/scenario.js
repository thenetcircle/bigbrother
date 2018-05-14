import * as logger from "./logger";
import MouseWatcher from "./watcher/mouse-watcher";
import DOMWatcher from "./watcher/dom-watcher";

class Scenario {

    constructor(watchdog, name) {
        this.watchdog = watchdog;
        this.name = name;
        this.isInited = false;

        this.domWatchers = [];
        this.mouseWatcher = null;
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

        try {
            this.checkIfInited();

            let domWatcher = new DOMWatcher(this.sender, this.sessionId);
            this.domWatchers.push(domWatcher);
            domWatcher.start(target);
        }
        catch (e) {
            logger.error(e.message)
        }

        return this;
    }

    /**
     * @returns {WatchDog}
     */
    watchMouseMove() {
        if (!this._checkDependencies()) return this;

        try {
            this._init();

            if (this.mouseWatcher === null) {
                this.mouseWatcher = new MouseWatcher(this.sender, this.sessionId);
                this.mouseWatcher.start();
            }
        }
        catch (e) {
            console.log(logger);
            logger.error(`watch mouse behavior failed with error: ${e}`);
        }
        return this;
    }

    checkIfInited() {
        if (!this.isInited) {

            // pass;

            this.isInited = true;
        }
    }

    start(context = {}) {
        if (typeof context !== 'object') {
            throw new Error('context is required as a object.');
        }
        this.context = context;

        return this;
    }

    /**
     * @returns {WatchDog}
     */
    stop() {
        try {
            if (this.domWatchers && this.domWatchers.length > 0) {
                this.domWatchers.forEach(function (w) {
                    w.stop();
                });
                this.domWatchers = [];
            }
            if (this.mouseWatcher !== null) {
                this.mouseWatcher.stop();
                this.mouseWatcher = null;
            }
        }
        catch (e) {
            logger.error(e.message)
        }
        return this;
    }

    _checkTarget(target) {
        if (typeof target !== 'object') return false;
        return true;
    }

}