const { invokeScript, broadcast, seedUtils, setScript } = require('@waves/waves-transactions');
const axios = require('axios');
const { exec } = require('child_process');
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

    async setScript(request, params) {
        const { branch, args, feeWaves, isRaw, isTextBody } = params;
        let { script } = params;

        console.log({ params });

        try {
            let compiledScript = '';
            if (isRaw == 1) {
                if (isTextBody == 1) {
                    script = request.body;
                }

                const query = `curl -X POST "${this.nodeUrl}/utils/script/compileCode"
                -H "accept: application/json" 
                -H "Content-Type: application/json" 
                -d "${script}"`
                    .replace(/\"/g, "'")
                    .replace(/\n/g, '');

                compiledScript = await new Promise((resolve) => {
                    exec(query, (err, stdout, stderr) => {
                        console.log(stdout);
                        resolve(JSON.parse(stdout));
                    });
                });
            }

            const params = {
                script: compiledScript, //true
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
