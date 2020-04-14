const { ControlOracle } = require('./Oracle');

class ContractController {
    controlOracle = new ControlOracle();

    async callInvoke({ name, params }) {
        if (name === 'control') {
            return await this.controlOracle.invoke(params);
        }
    }

    async setScript({ name, params }) {
        if (name === 'control') {
            return await this.controlOracle.setScript(params);
        }
    }
}

module.exports = ContractController;
