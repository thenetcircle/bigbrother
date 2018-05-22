import * as logger from '../logger';
import AbstractWatcher from './abstract-watcher';
import TreeMirrorClient from '../lib/tree-mirror-client';
import Utils from '../utils';

class DOMWatcher extends AbstractWatcher {

    /**
     * @param {Element} target
     */
    constructor(target) {
        super();

        if (typeof WebKitMutationObserver !== 'function') {
            throw new Error(
                'DOMWatcher requires WebKitMutationObserver (it is not supported by you browser).'
            );
        }

        if (!Utils.checkElement(target)) {
            throw new Error(
                'DOMWatcher requires a proper root target.'
            );
        }

        this.target = target;
        this.mirrorClient = null;
    }

    start() {
        if (this.mirrorClient !== null) {
            return;
        }

        this.mirrorClient = new TreeMirrorClient(this.target, {
            initialize: (rootId, children) => {
                let initData = {
                    'root-id': rootId,
                    'children': children,
                    'context': {
                        'uri': location.href,
                        'window-size': Utils.getWindowSize(),
                        'user-agent': navigator.userAgent
                    }
                };
                this.report('dom-init', initData);
            },

            applyChanged: (removed, addedOrMoved, attributes, text) => {
                if (!this.checkMaxIdleTime()) {
                    this.stop();
                    return;
                }

                if (removed.length || addedOrMoved.length || attributes.length || text.length) {
                    let data = [removed, addedOrMoved, attributes, text];
                    if (!this._checkChanges(data)) {
                        logger.debug('duplicated dom changes, buffer has updated.');
                        return;
                    }
                    this.report('dom-change', data);
                }
            }
        });
    }

    stop() {
        if (this.mirrorClient !== null) {
            this.mirrorClient.disconnect();
        }
    }

    _checkChanges(data) {
        if (this._checkIsStyleChanges(data)) {

            if (DOMWatcher._checkIsIgnoredStyles(data))
                return false;

            return this._checkAndUpdateBuffer(data, _data => this._checkIsStyleChanges(_data) && DOMWatcher._compareAttributes(data[2], _data[2]));

        }
        else if (this._checkIsDomChanges(data)) {

            return this._checkAndUpdateBuffer(data, _data => this._checkIsDomChanges(_data));

        }
        return true;
    }

    _checkAndUpdateBuffer(newData, checkFunc) {
        let bufferData = this.getScenario().getSender().getQueue();
        for (let index = 0; index < bufferData.length; index++) {
            let data = bufferData[index];
            let oldData = data['data'];

            if (!Array.isArray(oldData)) continue;

            if (checkFunc(oldData)) {
                data['data'] = newData;
                this.getScenario().getSender().updateQueue(index, data);
                return false;
            }
        }
        return true;
    }

    _checkIsStyleChanges(data) {
        return data[0].length === 0
            && data[1].length === 0
            && data[2].length > 0
            && data[3].length === 0
            && data[2].filter(node => {
                return node.attributes.style && DOMWatcher._getCountOfOwnProperty(node.attributes) === 1
            }).length === data[2].length;
    }

    _checkIsDomChanges(data) {
        return data[0].length === 0
            && data[1].length === 0
            && data[2].length > 0
            && data[3].length === 0
            && data[2].filter(node => {
                return node.attributes.d && DOMWatcher._getCountOfOwnProperty(node.attributes) === 1
            }).length === data[2].length;
    }

    static _checkIsIgnoredStyles(data) {
        return data[2].filter(node => {
            return node.attributes.style.indexOf('opacity:') !== -1
        }).length === data[2].length;
    }

    static _getCountOfOwnProperty(obj) {
        let count = 0;
        for (let prop in obj)
            if (obj.hasOwnProperty(prop))
                count++;
        return count;
    }

    static _compareAttributes(attrs1, attrs2) {
        if (attrs1.length !== attrs2.length)
            return false;
        for (let i = 0; i < attrs1.length; i++) {
            let a1 = attrs1[i], a2 = attrs2[i];
            if (a1.id !== a2.id)
                return false
        }
        return true
    }

}

export default DOMWatcher;
