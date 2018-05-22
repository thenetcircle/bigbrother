import BufferedSender from './sender/buffered-sender';
import Scenario from './scenario';

class Agent {

    /**
     * @param {string} endpoint
     * @param {object} metadata
     * @param {object} senderOptions
     */
    constructor(endpoint, metadata = {}, senderOptions = {}) {
        this.sender = new BufferedSender(endpoint, senderOptions);
        this.metadata = metadata;
    }

    /**
     * create or get a scenario with specific scenario name and metadata
     *
     * @param {string} name scenario name
     * @param {object} metadata scenario metadata / context
     * @return {Scenario}
     */
    getScenario(name, metadata = {}) {
        let scenarioMetadata = Object.assign({}, this.metadata, metadata);
        return new Scenario(name, this.sender, scenarioMetadata);
    }

}

export default Agent