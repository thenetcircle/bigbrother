import * as logger from '../logger';
import * as pako from 'pako/lib/deflate';

class Sender {

    constructor(endpoint) {
        if (typeof endpoint === 'undefined' || endpoint === '') {
            throw new Error('The endpoint is required.')
        }
        this.endpoint = endpoint;
    }

    send(metadata, data, successCallback, errorCallback, post = true, compress = true, withCredentials = false) {
        let method   = 'POST';
        let endpoint = this.endpoint + '?m=' + this.encodeURIComponent(metadata);
        if (compress) {
            endpoint += '&g=1';
            data = pako.gzip(data);
        }

        logger.debug(`going to send data => url: ${endpoint}, method: ${method}, metadata: ${metadata}`);

        if (window.XMLHttpRequest) {
            try {
                sender = new window.XMLHttpRequest();
                sender.onreadystatechange = () => {
                    if (sender.readyState !== 4 || !sender.status)
                        return;

                    const callbackData = {
                        status: sender.status,
                        response: sender.response
                    };
                    if (sender.status >= 200 && sender.status < 300) {
                        if (successCallback) successCallback(callbackData);
                    }
                    else {
                        logger.error("Error in callback (XMLHttpRequest): " + callbackData);
                        if (errorCallback) errorCallback(callbackData);
                    }
                };
                sender.open(method, endpoint, true);
                sender.setRequestHeader("Content-type", "text/plain");
                sender.withCredentials = !!withCredentials;
                sender.send(data);
            } catch (e) {
                logger.error("Error in transmission (XMLHttpRequest): " + e.message);
            }
        }
        else if (window.XDomainRequest) {
            try {
                sender = new window.XDomainRequest();
                sender.open(method, endpoint);
                sender.onload = function () {
                    if (successCallback) {
                        successCallback({
                            response: sender.responseText
                        });
                    }
                };
                sender.onerror = function () {
                    const callbackData = {
                        response: sender.responseText
                    };
                    logger.error("Error in callback (XDomainRequest): " + callbackData);
                    if (errorCallback) errorCallback(callbackData);
                };
                // sender.onprogress = function () {};
                // sender.ontimeout = function () {};
                sender.timeout = 20000;
                window.setTimeout(function () {
                    sender.send(data)
                }, 500);
            } catch (e) {
                logger.error("Error in transmission (XDomainRequest): " + e.message);
            }
        }
    }

    static encodeURIComponent(data) {
        try {
            return encodeURIComponent(data)
        } catch (e) {
            logger.error("encodeURIComponent failed with error " + e.message);
            return ""
        }
    }

}

export default Sender;