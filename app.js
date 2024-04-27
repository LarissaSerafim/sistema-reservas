const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');


app.use(bodyParser.json());
app.use('/', routes);

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});