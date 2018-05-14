import * as logger from './logger';
import Sender from './sender';
import Buffer from './buffer';

class WatchDog {

    constructor(endpoint, bufferOptions = {}) {
        this.inited = false;
        this.sessionId = this._generateSessionId();
        this.sender = new Sender(endpoint);
        this.buffer = new Buffer(this.sender, bufferOptions);
    }

    createScenario() {

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