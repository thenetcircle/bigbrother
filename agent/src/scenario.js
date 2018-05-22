import * as logger from "./logger";
import AbstractWatcher from "./watcher/abstract-watcher";
import Utils from './utils';

class Scenario {

    constructor(name, sender, metadata = {}) {
        this.name = name;
        this.sender = sender;
        this.metadata = metadata;

        this.running = false;
        this.watchers = [];
        this.sessionId = '';
        this.sequence = 0;
    }

    /**
     * runs the scenario with a new session
     */
    start() {
        if (this.watchers.length === 0) {
            logger.warn(`the scenario ${this.name} has no watchers, will not run.`);
            return;
        }
        if (this.running) {
            logger.warn(`the scenario ${this.name} is running already.`);
            return;
        }

        this.running = true;
        this.sessionId = this._generateSessionId();

        this._initSession();

        this.watchers.forEach(watcher => {
            try {
                watcher.start();
            }
            catch (e) {
                let watcherName = typeof watcher === 'object' ? watcher.constructor.name : '';
                logger.error(`Watcher ${watcherName} was failed to start with error ${e}`);
            }
        });
    }

    /**
     * stops the running scenario
     */
    stop() {
        if (!this.running) {
            logger.warn(`the scenario ${this.name} is not running.`);
            return;
        }

        this.running = false;
        this.sessionId = '';

        this.watchers.forEach(watcher => {
            try {
                watcher.stop();
            }
            catch (e) {
                let watcherName = typeof watcher === 'object' ? watcher.constructor.name : '';
                logger.error(`Watcher ${watcherName} was failed to stop with error ${e}`);
            }
        });
    }

    /**
     * runs the scenario with a existed session
     *
     * @param {string} sessionId
     */
    recover(sessionId) {
        if (this.running) {
            logger.warn(`the scenario ${this.name} is still running, stop it before recovering.`);
            return;
        }

        this.running = true;
        this.sessionId = sessionId;

        this.watchers.forEach(watcher => {
            try {
                watcher.start();
            }
            catch (e) {
                let watcherName = typeof watcher === 'object' ? watcher.constructor.name : '';
                logger.error(`Watcher ${watcherName} was failed to recover with error ${e}`);
            }
        });
    }

    /**
     * reports collected data to the sender
     *
     * @param {string} verb the verb of the act
     * @param {object|array|string} data the data of the act
     */
    report(verb, data) {
        let _data = {
            sid: this.sessionId,
            seq: ++this.sequence,
            verb: verb,
            time: +new Date(),
            data: data
        };

        this.sender.send(_data);
    }

    /**
     * sets new metadata during scenario running
     *
     * @param {object} metadata
     * @returns {Scenario}
     */
    setMetadata(metadata) {
        if (!this.running) {
            logger.warn('Metadata can not be set when Scenario is stopped.')
            return this;
        }
        if (!this._checkMetadata(metadata)) {
            logger.warn('Metadata can not be set because it is invalid format.')
            return this;
        }

        this.report('set-metadata', metadata);
        return this;
    }

    /**
     * adds a new watcher to the scenario
     *
     * @param {AbstractWatcher} watcher
     * @returns {Scenario}
     */
    addWatcher(watcher) {
        if (!watcher instanceof AbstractWatcher) {
            logger.warn('could not add watcher, it should extend {AbstractWatcher}.');
            return this;
        }

        this.watchers.push(watcher.withScenario(this));
        return this;
    }

    /**
     * @returns {BufferedSender}
     */
    getSender() {
        return this.sender;
    }

    _initSession() {
        this.report('sess-init', this.metadata);
        this.sequence = 0;
    }

    _generateSessionId() {
        return this.name + '-' + Utils.getFormattedDate() + '-' + Utils.getRandomInt(1000, 9999);
    }

    static _checkMetadata(metadata) {
        return typeof metadata === 'object';
    }

}

export default Scenario;