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
    }
}

module.exports = RouteController;
