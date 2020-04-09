const { invokeScript, broadcast, seedUtils } = require('@waves/waves-transactions');

class Oracle {
    constructor(name) {
        this.name = name;
    }

    invoke(params) {}

    parseParams(params) {
        return params.split(',').map((param) => {
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
    chainId = process.env.CHAIN_ID || 'T';
    seedData = new seedUtils.Seed(process.env.CONTROL_SEED, this.chainId)
    nodeUrl = process.env.NODE_URL || 'https://nodes-testnet.wavesnodes.com';

    constructor() {
        super('control');
    }

    async invoke(params) {
        const { branch, invocation, args, dApp, feeWaves } = params;

        const parsedParams = this.parseParams(args);
        // console.log({ seed: this.seedData, env: process.env })

        try {
            const params = {
                call: {
                    args: parsedParams,
                    function: invocation,
                },
                dApp: dApp || this.seedData.address,
                chainId: this.chainId,
                fee: Number(feeWaves),
                // feeAssetId: '73pu8pHFNpj9tmWuYjqnZ962tXzJvLGX86dxjZxGYhoK',
                //senderPublicKey: 'by default derived from seed',
                //timestamp: Date.now(),
                //fee: 100000,
                //chainId:
            };

            const signedTx = invokeScript(params, this.seedData.phrase);

            const broadcastResult = await broadcast(signedTx, this.nodeUrl);
            console.log({ broadcastResult })
            return broadcastResult;
        } catch (err) {
            console.log({ err })
            return err;
        }
    }
}

module.exports = { ControlOracle, Oracle };
