const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

app.get('/', (req, res) => {
    res.json({"msg":"start"})
}
)
app.use('/api', router);

app.listen(port)