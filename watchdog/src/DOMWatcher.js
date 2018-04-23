import * as logger from './logger';

class DOMWatcher {
    sender;
    recorderId;
    startupTime = +new Date();
    lastUpdateTime = 0;
    mirrorClient = null;

    constructor(sender, recorderId) {
        this.sender = sender;
        this.recorderId = recorderId;
    }

    inactiveCheck() {
        let timeout = 300000;
        let runningTime = (+new Date() - this.startupTime);
        if (runningTime - this.lastUpdateTime >= timeout) {
            this.stop();
            return false;
        }
        else {
            this.lastUpdateTime = runningTime;
            return true;
        }
    }

    start(target) {
        if (this.mirrorClient !== null) return;
        this.mirrorClient = new TreeMirrorClient(target, {
            initialize: (rootId, children) => {
                this.sender.send({
                    i: this.recorderId,
                    a: 'dinit',
                    t: +new Date(),
                    d: [rootId, children]
                }, true);
            },

            applyChanged: (removed, addedOrMoved, attributes, text) => {

                if (!this.inactiveCheck()) return;

                if (removed.length || addedOrMoved.length || attributes.length || text.length) {
                    let data = {
                        i: this.recorderId,
                        a: 'dchange',
                        t: +new Date(),
                        d: [removed, addedOrMoved, attributes, text]
                    };

                    if (!_checkChangedDOM(this.sender, data.d)) {
                        logger.debug('bypass dom changes');
                        return;
                    }

                    this.sender.send(data);
                }

            }
        });
    }

    stop() {
        if (this.mirrorClient !== null) {
            this.mirrorClient.disconnect();
        }
    }
}

function _checkChangedDOM(sender, args) {
    let isStyleChange = _checkIsStyleChange(args);
    let isDChange = _checkIsDChange(args);
    if (!isStyleChange && !isDChange) return true;
    if (_checkIsIgnoredStyles(args)) return false;

    // check duplication
    let buffer = sender.getBuffer();
    for (let i = 0; i < buffer.length; i++) {
        let oldData = buffer[i];
        if (oldData.f !== 'dchange') continue;
        let oldArgs = oldData.d;
        if (
            (isStyleChange && _checkIsStyleChange(oldArgs) && _compareAttributes(args[2], oldArgs[2]))
            || (isDChange && _checkIsDChange(oldArgs))
        ) {
            oldData.d = args;
            return false;
        }
    }
    return true;
}

function _checkIsStyleChange(args) {
    return args[0].length === 0
        && args[1].length === 0
        && args[2].length > 0
        && args[3].length === 0
        && args[2].filter(node => {
            return node.attributes.style && _getCountOfOwnProperty(node.attributes) === 1
        }).length === args[2].length;
}

function _checkIsIgnoredStyles(args) {
    return args[2].filter(node => {
        return node.attributes.style.indexOf('opacity:') !== -1
    }).length === args[2].length;
}

function _checkIsDChange(args) {
    return args[0].length === 0
        && args[1].length === 0
        && args[2].length > 0
        && args[3].length === 0
        && args[2].filter(node => {
            return node.attributes.d && _getCountOfOwnProperty(node.attributes) === 1
        }).length === args[2].length;
}

function _getCountOfOwnProperty(obj) {
    let count = 0;
    for (let prop in obj)
        if (obj.hasOwnProperty(prop))
            count++;
    return count;
}

function _compareAttributes(attrs1, attrs2) {
    if (attrs1.length !== attrs2.length)
        return false;
    for (let i = 0; i < attrs1.length; i++) {
        let a1 = attrs1[i], a2 = attrs2[i];
        if (a1.id !== a2.id)
            return false
    }
    return true
}

export default DOMWatcher;
