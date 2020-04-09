const { invokeScript, broadcast, seedUtils } = require('@waves/waves-transactions');

class Oracle {
    constructor(name) {
        this.name = name;
    }

    invoke(params) {}

    parseParams(params) {
        return params.map((param) => {
            let [value, type] = param.split(':');
            if (type === 'integer') {
                value = Number(value);
            }
            if (type === 'boolean') {
                value = Boolean(value);
            }
            return { type: type, value };
        });
    }
}

class ControlOracle extends Oracle {
    seedData = seedUtils.fromExistingPhrase(process.env.CONTROL_SEED);
    chainId = process.env.CHAIN_ID || 'T';
    nodeUrl = process.env.NODE_URL || 'https://nodes-testnet.wavesnodes.com';

    constructor() {
        super('control');
    }

    async invoke(params) {
        const { branch, invocation, args, dApp } = params;

        const parsedParams = this.parseParams(args);

        try {
            const params = {
                call: {
                    args: parsedParams,
                    function: invocation,
                },
                dApp: dApp || this.seedData.address,
                chainId: this.chainId,
                // fee: 100000,
                // feeAssetId: '73pu8pHFNpj9tmWuYjqnZ962tXzJvLGX86dxjZxGYhoK',
                //senderPublicKey: 'by default derived from seed',
                //timestamp: Date.now(),
                //fee: 100000,
                //chainId:
            };

            const signedTx = invokeScript(params, this.seedData.seed);

            const broadcastResult = await broadcast(signedTx, this.nodeUrl);

            return broadcastResult;
        } catch (err) {
            return err;
        }
    }
}

module.exports = { ControlOracle, Oracle };
