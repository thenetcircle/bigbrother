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
                this.report('dom.init', initData);
            },

            applyChanged: (removed, addedOrMoved, attributes, text) => {
                if (!this.checkMaxIdleTime()) {
                    this.stop();
                    return;
                }

                if (removed.length || addedOrMoved.length || attributes.length || text.length) {
                    let data = {
                        'removed': removed,
                        'changed': addedOrMoved,
                        'attrs': attributes,
                        'text': text
                    };

                    if (!this._checkChanges(data)) {
                        logger.debug('duplicated dom changes, buffer has updated.');
                        return;
                    }

                    this.report('dom.change', data);
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

            return this._checkAndUpdateBuffer(
                data,
                _data => this._checkIsStyleChanges(_data) && DOMWatcher._compareAttributes(data['attrs'], _data['attrs'])
            );

        }
        else if (this._checkIsDomChanges(data)) {

            return this._checkAndUpdateBuffer(data, _data => this._checkIsDomChanges(_data));

        }
        return true;
    }

    _checkAndUpdateBuffer(newData, checkFunc) {
        let queuedData = this.getScenario().getSender().getQueue();
        for (let index = 0; index < queuedData.length; index++) {
            let data = queuedData[index];
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
        return data['removed'].length === 0
            && data['changed'].length === 0
            && data['attrs'].length > 0
            && data['text'].length === 0
            && data['attrs'].filter(node => {
                return node.attributes.style && Utils.getCountOfOwnProperty(node.attributes) === 1
            }).length === data['attrs'].length;
    }

    _checkIsDomChanges(data) {
        return data['removed'].length === 0
            && data['changed'].length === 0
            && data['attrs'].length > 0
            && data['text'].length === 0
            && data['attrs'].filter(node => {
                return node.attributes.d && Utils.getCountOfOwnProperty(node.attributes) === 1
            }).length === data['attrs'].length;
    }

    static _checkIsIgnoredStyles(data) {
        return data['attrs'].filter(node => {
            return node.attributes.style.indexOf('opacity:') !== -1
        }).length === data['attrs'].length;
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
