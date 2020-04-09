
class RouteController {
    provideRoutes(app) {
        app.get('/testnet', async (req, res) => {
            const { branch, sc, invocation, args } = req.query;

            // console.log({ branch, sc, invocation });

            console.log(``)
            
            const result = await app.contract.callInvoke({
                name: sc,
                params: { branch, invocation, args },
            });

            res.send(result)
        });
    }
}

module.exports = RouteController;
