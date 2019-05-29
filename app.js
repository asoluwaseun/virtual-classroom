//Required Modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const routes = require('./routes/index');


// MiddleWares
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
require('dotenv').config();

//Clusters
if (cluster.isMaster) {
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
    	console.log('worker', worker.id, ' exited!')
    	cluster.fork()
	})
} 
else {
    const port = process.env.PORT || 5200;
    app.listen(port);
    console.log('app is running on port', port);
  }

//Routes
app.use('/', routes);

//404 response
app.use(function (req, res) {
    let response = {
        statusCode: 404,
        status: "Not found",
        url: req.originalUrl
    }
    res.status(404).send(response);
});