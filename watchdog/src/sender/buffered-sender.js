import * as logger from '../logger';
import Sender from './sender';

class BufferedSender extends Sender {

    constructor(endpoint, options = {}) {
        super(endpoint);

        let defaultOptions = {
            'maxTime': 4000, // millisecond
            'maxCount': 20, // max queue count
            'minCount': 2,
            'maxSize': 100000, // max content size
            'minSize': 1000,
            'maxPending': 3, // max pending requests
            'maxErrors': 3 // max error requests
        };
        Object.assign(this, defaultOptions, options);

        this.buffer = [];
        this.totalSize = 0;
        this.timer = null;
        this.lastTime = +new Date();
        this.verb = 'e17r';
        this.pending = 0;
        this.errors = 0;
        this.sequence = 0;
    }

    send(data, delay = false) {
        if (data) {
            this.buffer.push(data);
            if (!delay) this.totalSize += this._getDataSize(data);
        }

        if (delay) return;
        if (this.pending >= this.maxPending) return;
        if (this.errors >= this.maxErrors) return;

        if (
            (this.buffer.length >= this.maxCount)
            || (this.totalSize >= this.maxSize)
            || (
                (this.buffer.length >= this.minCount || this.totalSize >= this.minSize)
                && (+new Date() - this.lastTime) >= this.maxTime
            )
        ) {
            let interval = (+new Date() - this.lastTime)
            logger.debug(`going to send buffer, length: ${this.buffer.length}, total size: ${this.totalSize}, interval: ${interval}`);
            this._sendBuffer();
        }
    }

    getBuffer() {
        return this.buffer;
    }

    _sendBuffer() {
        this.lastTime = +new Date();
        if (this.buffer.length === 0) return;

        // send data
        let data = '';
        for (let i = 0; i < this.buffer.length; i++) {
            this.sequence++;
            let _d = this.buffer[i];
            _d['s'] = this.sequence;
            // if (_d['d']) _d['d'] = this._jsonify(_d['d']); // format data again for easier to store

            let _msg = this._jsonify(_d);
            data += (data != '' ? '|||' : '') + _msg;
        }

        logger.debug('going to send data ' + data);

        if (data.length > 0) {
            this._send(data);
        }

        // reset vars
        this.buffer = [];
        this.totalSize = 0;
        this._resetTimer();
    }

    _send(data) {
        this.pending++;

        let metadata = this._jsonify({});

        super.send(
            metadata,
            data,
            callbackData => {
                this.pending--
            },
            callbackData => {
                this.pending--;
                this.errors++;
            }
        );
    }

    _resetTimer() {
        // if (!this.timer) {
        //     this.timer = setInterval(this.send.bind(this), this.maxTime);
        // }
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.send.bind(this), this.maxTime);
    }

    _jsonify(data) {
        return JSON.stringify(data);
    }

    _getDataSize(data) {
        let size = 0;
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (typeof data[k] === 'object') {
                    size += this._getDataSize(data[k]);
                }
                else if (typeof data[k] === 'string') {
                    size += k.length + data[k].length
                }
                else {
                    size += k.length
                }
            }
        }
        return size;
    }

}

export default BufferedSender;
