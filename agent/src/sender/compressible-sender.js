import * as logger from '../logger';
import * as pako from 'pako/lib/deflate';

class CompressibleSender {

    constructor(endpoint) {
        if (!endpoint) {
            throw new Error('CompressibleSender requires EndPoint!')
        }
        this.endpoint = endpoint;
    }

    /**
     * @param {Array} dataList
     * @param {function} preCallback calls before sending
     * @param {function} successCallback calls after sending successfully
     * @param {function} errorCallback calls after sending failed
     */
    batchSend(dataList, preCallback = () => {}, successCallback = () => {}, errorCallback = () => {}) {
        let delimiter = '|||';
        let dataString = '';

        dataList.forEach(data => {
            if (dataString !== '') dataString += delimiter;
            dataString += JSON.stringify(data);
        });

        if (dataString !== '') {
            this.send(dataString, preCallback, successCallback, errorCallback);
        }
    }

    send(data, preCallback = () => {}, successCallback = () => {}, errorCallback = () => {}, compress = true, withCredentials = false) {
        let method   = 'POST';
        let endpoint = this.endpoint;
        if (compress) {
            endpoint += ((endpoint.indexOf('?') !== -1) ? '&' : '?') + 'g=1';
            data = pako.gzip(data);
        }

        logger.debug(`going to send data to: ${endpoint}, with params: compress ${compress}, withCredentials: ${withCredentials}`);

        if (window.XMLHttpRequest) {
            try {
                let sender = new window.XMLHttpRequest();
                sender.onreadystatechange = () => {
                    if (sender.readyState !== 4 || !sender.status)
                        return;

                    const context = {
                        status: sender.status,
                        response: sender.response
                    };
                    if (sender.status >= 200 && sender.status < 300) {
                        if (successCallback) {
                            successCallback(context);
                        }
                    }
                    else {
                        logger.warn(`Unexpected HTTP Response (XMLHttpRequest), Status: ${sender.status}, Response: ${sender.response}`);
                        if (errorCallback) {
                            errorCallback(context);
                        }
                    }
                };
                sender.open(method, endpoint, true);
                sender.setRequestHeader("Content-type", "text/plain");
                sender.withCredentials = !!withCredentials;
                preCallback({});
                sender.send(data);
            } catch (e) {
                logger.error("Sending HTTP Request (XMLHttpRequest) Failed With Error: " + e.message);
            }
        }
        else if (window.XDomainRequest) {
            try {
                let sender = new window.XDomainRequest();
                sender.open(method, endpoint);
                sender.onload = function () {
                    if (successCallback) {
                        successCallback({
                            response: sender.responseText
                        });
                    }
                };
                sender.onerror = function () {
                    const context = {
                        response: sender.responseText
                    };
                    logger.warn(`Sending HTTP Request (XDomainRequest) Failed With Response: ${sender.responseText}`);
                    if (errorCallback) {
                        errorCallback(context);
                    }
                };
                // sender.onprogress = function () {};
                // sender.ontimeout = function () {};
                sender.inactiveTimeout = 20000;
                window.setTimeout(function () {
                    preCallback({});
                    sender.send(data);
                }, 500);
            } catch (e) {
                logger.error("Sending HTTP Request (XDomainRequest) Failed With Error: " + e.message);
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

export default CompressibleSender;