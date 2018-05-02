import * as logger from './logger';
import DOMWatcher from './watcher/dom-watcher';
import MouseWatcher from './watcher/mouse-watcher';

class WatchDog {

    constructor(sender, userId) {
        this._inited = false;
        this._userId = userId;
        this._recorderId = this._getRecorderId(userId);
        this._sender = sender;
        this._DOMWatchers = [];
        this._MouseWatcher = null;
    }

    /**
     * @param  {Element} target
     * @returns {WatchDog}
     */
    watchDOM(target) {
        if (!this._checkObserver()) return this;

        try {
            this._init();

            var domWatcher = new DOMWatcher(this._sender, this._recorderId);
            this._DOMWatchers.push(domWatcher);
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
        if (!this._checkObserver()) return this;

        try {
            this._init();

            if (this._MouseWatcher === null) {
                this._MouseWatcher = new MouseWatcher(this._sender, this._recorderId);
                this._MouseWatcher.start();
            }
        }
        catch (e) {
            logger.error(e.message);
        }
        return this;
    }

    /**
     * @returns {WatchDog}
     */
    stopWatch() {
        try {
            if (this._DOMWatchers && this._DOMWatchers.length > 0) {
                this._DOMWatchers.forEach(function (w) {
                    w.stop();
                });
                this._DOMWatchers = [];
            }
            if (this._MouseWatcher !== null) {
                this._MouseWatcher.stop();
                this._MouseWatcher = null;
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
        if (!this._inited) {
            this._sender.send({
                i: this._recorderId,
                a: 'init',
                t: +new Date(),
                d: {
                    "userId": this._userId,
                    "url": location.href,
                    "window": this._getWindowSize(),
                    "user-agent": navigator.userAgent
                }
            }, true);

            this._inited = true;
        }
        return this;
    }

    _getRecorderId(userId) {
        return userId + '-' + this._getFormattedDate() + '-' + this._getRandomInt(1000, 9999);
    }

    _checkObserver() {
        if (typeof WebKitMutationObserver !== 'function') {
            logger.error('EasyRecorder requires MutationObservers.');
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