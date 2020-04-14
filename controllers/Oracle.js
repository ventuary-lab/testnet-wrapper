const { invokeScript, broadcast, seedUtils, setScript } = require('@waves/waves-transactions');
const axios = require('axios');
class Oracle {
    constructor(name) {
        this.name = name;
    }

    parseParams(params) {
        return params.split(',').map((param) => {
            let [value, type = 'string'] = param.split(':');
            if (type === 'integer') {
                value = Number(value);
            }
            if (type === 'boolean') {
                value = Boolean(value);
            }
            return { type: type, value };
        });
    }

    async invoke(params) {
        const { branch, invocation, args, dApp, feeWaves } = params;

        const parsedParams = this.parseParams(args);

        try {
            const params = {
                call: {
                    args: parsedParams,
                    function: invocation,
                },
                dApp: dApp || this.seedData.address,
                chainId: this.chainId,
                fee: Number(feeWaves),
            };

            const signedTx = invokeScript(params, this.seedData.phrase);

            const broadcastResult = await broadcast(signedTx, this.nodeUrl);
            // console.log({ broadcastResult });
            return broadcastResult;
        } catch (err) {
            console.log({ err });
            return err;
        }
    }

    async setScript(params) {
        const { branch, args, feeWaves, isRaw } = params;
        let { script } = params;

        console.log({ params });

        try {
            if (isRaw == 1) {
                const response = await axios.post('/utils/script/compileCode',  script, {
                    baseURL: this.nodeUrl,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log({ data: response.data });
            }

            return;

            const params = {
                script: 'AQa3b8tH', //true
                timestamp: Date.now(),
                chainId: this.chainId,
                fee: Number(feeWaves),
            };

            const signedTx = setScript(params, this.seedData.phrase);

            const broadcastResult = await broadcast(signedTx, this.nodeUrl);
            // console.log({ broadcastResult });
            return broadcastResult;
        } catch (err) {
            console.log({ err });
            return err;
        }
    }
}

class ControlOracle extends Oracle {
    chainId = process.env.CHAIN_ID || 'T';
    seedData = new seedUtils.Seed(process.env.CONTROL_SEED, this.chainId);
    nodeUrl = process.env.NODE_URL || 'https://nodes-testnet.wavesnodes.com';

    constructor() {
        super('control');
    }
}

module.exports = { ControlOracle, Oracle };
