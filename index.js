require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/Router'); // Assuming 'router.js' is in the 'routes' folder
const app = express();
const PORT = 8900;
const swaggerUi = require('swagger-ui-express');
const mongo_url = process.env.MONGO_URL;
const cors = require("cors");


// Apply CORS Middleware
app.use(cors());
// Middleware
app.use(bodyParser.json());
// Serve Swagger UI
const swaggerDocument = require('./server/swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routes
app.use('/', apiRouter);

mongoose.connect(mongo_url)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch((error) => {
        console.error("Error connecting to the database:", error);
    });


app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server Running on Port " + PORT);
    } else {
        console.log("Error :" + error)
    }
});
