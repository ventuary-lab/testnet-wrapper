class RouteController {
    provideRoutes(app) {
        app.get('/testnet', async (req, res) => {
            const { branch, sc, invocation, args, feeWaves } = req.query;

            // console.log({ branch, sc, invocation });

            const result = await app.contract.callInvoke({
                name: sc,
                params: { branch, invocation, args, feeWaves },
            });

            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ result }));
        });


        app.post('/testnet/set-script', async (req, res) => {
            const { branch, sc, feeWaves, isRaw, isTextBody } = req.query;
            const { script } = req.body

            let result = {};

            if (!script && isTextBody != 1) {
                result = { message: 'Empty script' }
            } else {
                result = await app.contract.setScript({
                    name: sc,
                    request: req,
                    params: { branch, sc, feeWaves, isRaw, isTextBody, script },
                });
            }

            res.set('Content-Type', 'application/json');
            res.send(JSON.stringify({ result }));
        });
    }
}

module.exports = RouteController;
