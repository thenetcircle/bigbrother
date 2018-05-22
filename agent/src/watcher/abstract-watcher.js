class AbstractWatcher {

    constructor() {
        this.startupTime = +new Date();
        this.lastUpdateTime = 0;
        this.scenario = null;
        this.maxIdleTime = 300000;
    }

    /**
     * @param {Scenario} scenario
     * @returns {AbstractWatcher}
     */
    withScenario(scenario) {
        this.scenario = scenario;
        return this;
    }

    /**
     * @param {int} idleTime max idle time (seconds) before stop the watcher
     * @returns {AbstractWatcher}
     */
    withMaxIdleTime(idleTime) {
        this.maxIdleTime = idleTime;
        return this;
    }

    /**
     * @returns {Scenario}
     */
    getScenario() {
        if (this.scenario === null) {
            throw new Error('scenario does not set.');
        }
        return this.scenario;
    }

    /**
     * checks if reach the maximum idletime
     * @returns {boolean}
     */
    checkMaxIdleTime() {
        let runTime = (+new Date() - this.startupTime);
        if (runTime - this.lastUpdateTime >= this.maxIdleTime) {
            return false;
        }
        else {
            this.lastUpdateTime = runTime;
            return true;
        }
    }

    /**
     * @param {string} verb
     * @param {object|array|string} data
     */
    report(verb, data) {
        this.scenario.report(verb, data);
    }

}

export default AbstractWatcher;