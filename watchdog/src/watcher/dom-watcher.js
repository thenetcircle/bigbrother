import * as logger from '../logger';
import TreeMirrorClient from 'mutation-summary/util/tree-mirror';
import AbstractWatcher from './abstract-watcher';

class DOMWatcher extends AbstractWatcher {

    /**
     * @param {Element} target
     * @param {Scenario} scenario
     * @param {int} inactiveTimeout
     */
    constructor(target, scenario, inactiveTimeout = 300000) {
        super(scenario, inactiveTimeout);
        this.target = target;
        this.mirrorClient = null;
    }

    start() {
        if (this.mirrorClient !== null) {
            return;
        }

        this.mirrorClient = new TreeMirrorClient(this.target, {
            initialize: (rootId, children) => {
                this.report('dom-init', [rootId, children]);
            },

            applyChanged: (removed, addedOrMoved, attributes, text) => {
                if (!this.checkIfExpired()) {
                    this.stop();
                    return;
                }

                if (removed.length || addedOrMoved.length || attributes.length || text.length) {
                    let data = [removed, addedOrMoved, attributes, text];
                    if (!this._checkChanges(data)) {
                        logger.debug('bypass dom changes');
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
        let isStyleChanges = this._checkIsStyleChanges(data);
        let isDomChanges = this._checkIsDomChanges(data);

        if (!isStyleChanges && !isDomChanges) return true;
        if (this._checkIsIgnoredStyles(data)) return false;

        // check duplication
        let buffer = this.scenario.getBuffer().getBuffer();
        for (let i = 0; i < buffer.length; i++) {
            let _data = buffer[i];
            if (
                (isStyleChanges && this._checkIsStyleChanges(_data) && this._compareAttributes(data[2], _data[2]))
                ||
                (isDomChanges && this._checkIsDomChanges(_data))
            ) {
                this.scenario.getBuffer().updateBuffer(i, data);
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
                return node.attributes.style && this._getCountOfOwnProperty(node.attributes) === 1
            }).length === data[2].length;
    }

    _checkIsIgnoredStyles(data) {
        return data[2].filter(node => {
            return node.attributes.style.indexOf('opacity:') !== -1
        }).length === data[2].length;
    }

    _checkIsDomChanges(data) {
        return data[0].length === 0
            && data[1].length === 0
            && data[2].length > 0
            && data[3].length === 0
            && data[2].filter(node => {
                return node.attributes.d && this._getCountOfOwnProperty(node.attributes) === 1
            }).length === data[2].length;
    }

    _getCountOfOwnProperty(obj) {
        let count = 0;
        for (let prop in obj)
            if (obj.hasOwnProperty(prop))
                count++;
        return count;
    }

    _compareAttributes(attrs1, attrs2) {
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
