require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./utils/error-handler");
const jwt = require("./utils/exceptionsJWT");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(bodyParser.urlencoded({ limit: "150mb", extended: false }));
app.use(bodyParser.json({ limit: "150mb" }));
app.use(cors());

app.use((req,res,next)=>{
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(ip);
    next();
})

//app.use(jwt());

app.use('/categories', require('./categories/categories.controller'));
app.use('/clients', require('./clients/clients.controller'));
app.use('/users', require('./users/users.controller'));
app.use('/tasks', require('./tasks/tasks.controller'));



app.use(errorHandler);

const port = process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
const server = app.listen(port, function () {
    console.log("Server listening on port " + port);
});