const express = require('express');
const dotenv = require('dotenv');
const ContractController = require('./controllers/ContractController');
const RouteController = require('./controllers/RouteController');

const grabParam = (param) =>
    process.argv.indexOf(param) !== -1 ? process.argv[process.argv.indexOf(param) + 1] : null;
const port = grabParam('--port') || 8005;

const envProvided = dotenv.config();
if (!envProvided) {
    dotenv.config({ path: __dirname + '.env.example' });
}

const app = express();
app.contract = new ContractController();

const router = new RouteController();
router.provideRoutes(app);

app.listen(port, () => {
    console.log(`Server started at ${port} port`);
});
