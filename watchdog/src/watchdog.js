import * as logger from './logger';
import DOMWatcher from './watcher/dom-watcher';
import MouseWatcher from './watcher/mouse-watcher';
import BufferedSender from './sender/buffered-sender';

class WatchDog {

    constructor(sceneName, context, endpoint, requestOptions = {}) {
        this.isInited = false;
        this.sessionId = this._generateSessionId();
        this.domWatchers = [];
        this.mouseWatcher = null;
        this.sender = new BufferedSender(endpoint, requestOptions);
    }

    /**
     * @param  {Element} target
     * @returns {WatchDog}
     */
    watchDOM(target) {
        if (!this._checkDependencies()) return this;
        if (typeof target !== 'object') {
            logger.error('watchDOM requires a target object.');
            return this;
        }

        try {
            this._init();

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
    watchMouse() {
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

    /**
     * @returns {WatchDog}
     */
    stopWatch() {
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

    /**
     * @returns {WatchDog}
     */
    _init() {
        if (!this.isInited) {
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

            this.isInited = true;
        }
        return this;
    }

    _checkDependencies() {
        if (typeof WebKitMutationObserver !== 'function') {
            logger.error('WatchDog requires MutationObservers (which may not be supported for some old browsers).');
            return false;
        }
        return true;
    }

    _getWindowSize() {
        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return [x, y];
    }

    _generateSessionId() {
        return this._getFormattedDate() + '-' + this._getRandomInt(1000, 9999);
    }

    _getFormattedDate() {
        let d = new Date();
        d = "" + d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) +
            ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2) + ('0' + d.getSeconds()).slice(-2);
        return d;
    }

    _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

}

if (typeof window === 'object' && typeof window.document === 'object') {
    window.WatchDog = WatchDog
}