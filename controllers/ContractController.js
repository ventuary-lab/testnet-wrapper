const { ControlOracle } = require('./Oracle');

class ContractController {
    controlOracle = new ControlOracle();

    async callInvoke({ name, params }) {
        console.log({ name, params })
        if (name === 'control') {
            return await this.controlOracle.invoke(params);
        }
    }
}

module.exports = ContractController;
