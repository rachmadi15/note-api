const express = require('express');
const app = express();

const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const notesRouter = require('./routes/notes');
const userRouter = require('./routes/user');



// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect 
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');

    // Pass to next layer of middleware
    next();
});


const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "A simple express library API"
        },
        server: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());

app.use("", userRouter)
app.use("/note", notesRouter)


app.listen(3000, () => {
    console.log('Server Running');
})