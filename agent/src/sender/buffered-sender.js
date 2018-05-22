import * as logger from '../logger';
import CompressibleSender from './compressible-sender';

class BufferedSender {

    /**
     * @param {string} endpoint
     * @param {object} options
     */
    constructor(endpoint, options = {}) {
        let defaultOptions = {
            'maxTime': 4000,   // millisecond
            'maxCount': 20,    // maximum buffer elements count
            'minCount': 2,     // minimum buffer elements count
            'maxSize': 100000, // maximum buffer data size
            'minSize': 1000,   // minimum buffer data size
            'maxPending': 3,   // maximum pending requests
            'maxErrors': 3     // maximum error requests
        };
        Object.assign(this, defaultOptions, options);

        this.buffer = [];
        this.sender = new CompressibleSender(endpoint);
        this.totalSize = 0;
        this.timer = null;
        this.lastFlushTime = +new Date();
        this.pending = 0;
        this.errors = 0;
    }

    /**
     * sends data to buffer or to the endpoint (based on buffer settings)
     *
     * @param {object} data
     */
    send(data) {
        if (!data) return;
        this.buffer.push(data);
        this.totalSize += this._getDataSize(data);
        this._checkFlush();
    }

    /**
     * @returns {Array}
     */
    getQueue() {
        return this.buffer;
    }

    /**
     * @param {int} index
     * @param {object} data
     *
     * @returns {BufferedSender}
     */
    updateQueue(index, data) {
        this.buffer[index] = data;
        return this;
    }

    _checkFlush() {
        if (this.pending >= this.maxPending || this.errors >= this.maxErrors) {
            logger.warn(`either pending number: ${this.pending} or errors number: ${this.errors} has exceeded the maximum amount.`);
            return;
        }

        if (
            (this.buffer.length >= this.maxCount)
            || (this.totalSize >= this.maxSize)
            || (
                (this.buffer.length >= this.minCount || this.totalSize >= this.minSize)
                && (+new Date() - this.lastFlushTime) >= this.maxTime
            )
        ) {
            let interval = (+new Date() - this.lastFlushTime);
            logger.debug(`going to flush buffer, length: ${this.buffer.length}, total size: ${this.totalSize}, interval: ${interval}`);
            this._flushBuffer();
        }
    }

    _flushBuffer() {
        this.lastFlushTime = +new Date();
        let bufferLength = this.buffer.length;
        if (bufferLength === 0) return;

        logger.debug('flushing buffered elements: ' + bufferLength);

        this.sender.batchSend(
            this.getQueue(),
            () => {
                this.pending += bufferLength;
            },
            () => {
                this.pending -= bufferLength;
            },
            () => {
                this.pending -= bufferLength;
                this.errors  ++;
            }
        );

        // reset vars
        this.buffer = [];
        this.totalSize = 0;
        this._resetTimer();
    }

    _resetTimer() {
        // if (!this.timer) {
        //     this.timer = setInterval(this.send.bind(this), this.maxTime);
        // }
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this._checkFlush.bind(this), this.maxTime);
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
