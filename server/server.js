// Server code

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/index');
const app = express();
const port = config.port;

// Connect to db
mongoose.connect(config.dbConnection, {useNewUrlParser: true});
app.use(bodyParser.json());
app.use(cors());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
	res.send(`Server listening on port ${port}`)
})

// listen on the port
app.listen(port);

module.exports = app;