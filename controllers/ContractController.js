const { ControlOracle } = require('./Oracle');

class ContractController {
    controlOracle = new ControlOracle();

    async callInvoke({ name, params }) {
        if (name === 'control') {
            return await this.controlOracle.invoke(params);
        }
    }

    async setScript({ name, params, request }) {
        if (name === 'control') {
            return await this.controlOracle.setScript(request, params);
        }
    }
}

module.exports = ContractController;
