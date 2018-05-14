import * as logger from './logger';
import Scenario from './scenario';
import DOMWatcher from './watcher/dom-watcher';
import MouseWatcher from './watcher/mouse-watcher';
import BufferedSender from './sender/buffered-sender';

class WatchDog {

    constructor(endpoint, requestOptions = {}) {
        this.isInited = false;
        this.sessionId = this._generateSessionId();
        this.domWatchers = [];
        this.mouseWatcher = null;
        this.sender = new BufferedSender(endpoint, requestOptions);
    }

    createScenario() {

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

export default WatchDog