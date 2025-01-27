const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Ecommerce',
        description: 'API documentation for managing Ecommerce Project',
        version: '1.0.0',
    },
    host: 'localhost:8900', // Adjust this as per your server URL
    schemes: ['http'],
};

const outputFile = './swagger-output.json'; // Output file
const endpointsFiles = ['../routes/Router.js']; // Path to your routes file(s)

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    // Start your server after generating the documentation
    require('../index.js'); // Replace with the entry point of your application
});
