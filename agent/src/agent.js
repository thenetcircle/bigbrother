import * as logger from './logger';
import Sender from './sender';
import Buffer from './buffer';
import Scenario from './scenario';

class BigBrotherAgent {

    constructor(endpoint, bufferOptions = {}) {
        this.sender = new Sender(endpoint);
        this.buffer = new Buffer(this.sender, bufferOptions);
    }

    createScenario(name, context = {}) {
        return new Scenario(name, this.buffer, context);
    }

}

export default BigBrotherAgent