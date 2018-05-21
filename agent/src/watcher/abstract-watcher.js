class AbstractWatcher {

    /**
     * @param {Scenario} scenario
     * @param {int} inactiveTimeout
     */
    constructor(scenario, inactiveTimeout) {
        this.scenario = scenario;
        this.inactiveTimeout = inactiveTimeout;

        this.startupTime = +new Date();
        this.lastUpdateTime = 0;
    }

    checkIfExpired() {
        let runTime = (+new Date() - this.startupTime);
        if (runTime - this.lastUpdateTime >= this.inactiveTimeout) {
            return false;
        }
        else {
            this.lastUpdateTime = runTime;
            return true;
        }
    }

    /**
     * @param {string} verb
     * @param {mix} data
     */
    report(verb, data) {
        this.scenario.report(verb, data);
    }

}

export default AbstractWatcher;