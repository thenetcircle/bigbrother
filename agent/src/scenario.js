import * as logger from "./logger";
import DOMWatcher from "./watcher/dom-watcher";
import MouseMovementWatcher from "./watcher/mouse-movement-watcher";
import MouseClickWatcher from "./watcher/mouse-click-watcher";
import ScrollWatcher from "./watcher/scroll-watcher";

class Scenario {

    constructor(name, buffer, metadata = {}) {
        this.name = name;
        this.buffer = buffer;
        this.metadata = metadata;

        this.sessionId = this._generateSessionId();
        this.sessionInited = false;
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
        if (!Scenario._checkTarget(target)) {
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
        if (!Scenario._checkTarget(target)) {
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
        if (!Scenario._checkTarget(target)) {
            logger.warn('watchMouseClick requires a proper target.');
            return this;
        }

        this.watchers.push(new MouseClickWatcher(target, this));
        return this;
    }

    /**
     * @returns {Scenario}
     */
    watchScroll() {
        this.watchers.push(new ScrollWatcher(this));
        return this;
    }

    initSession() {
        if (!this.sessionInited) {
            let envInfo = {
                'uri': location.href,
                'window-size': Scenario._getWindowSize(),
                'user-agent': navigator.userAgent,
                'cookie': document.cookie
            };

            let initData = Object.assign({}, envInfo, this.metadata);
            this.report('sess-init', initData);
            this.sessionInited = true;
            this.sequence = 0;
        }
    }

    start() {
        if (this.watchers.length === 0) return;

        this.initSession();

        this.watchers.forEach(watcher => {
            try {
                watcher.start();
            }
            catch (e) {
                let watcherName = typeof watcher === 'object' ? watcher.constructor.name : '';
                logger.error(`Watcher ${watcherName} was failed to start with error ${e}`);
            }
        });
    }

    /**
     * @returns {Scenario}
     */
    stop() {
        this.watchers.forEach(watcher => {
            try {
                watcher.stop();
            }
            catch (e) {
                let watcherName = typeof watcher === 'object' ? watcher.constructor.name : '';
                logger.error(`Watcher ${watcherName} was failed to stop with error ${e}`);
            }
        });
    }

    /**
     * @param {string} verb
     * @param {mixed} data
     */
    report(verb, data) {
        let _data = {
            sid: this.sessionId,
            seq: ++this.sequence,
            type: verb,
            time: +new Date(),
            data: data
        };

        this.buffer.add(_data);
    }

    getBuffer() {
        return this.buffer;
    }

    _generateSessionId() {
        return this.name + '-' + Scenario._getFormattedDate() + '-' + Scenario._getRandomInt(1000, 9999);
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

    static _getFormattedDate() {
        let d = new Date();
        d = "" + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) +
            ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
        return d;
    }

    static _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

}

export default Scenario;