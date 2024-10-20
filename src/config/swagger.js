require('dotenv').config();
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


const PORT = process.env.PORT || 3500;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Online Shop API',
            description: "API endpoints for a online Shop services documented on swagger",
            contact: {
                name: "Mohammad Parvizi",
                email: "dev.mohammad.parvizi@gmail.com",
            },
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization'
                }
            }
        },
        security: [
            {
                ApiKeyAuth: []
            }
        ],
        servers: [
            {
                url: "http://localhost:" + PORT + '/',
                description: "Local server"
            },
            {
                url: "https://shop-backend.liara.run/",
                description: "Live server"
            },
        ]
    },
    apis: ['./src/routes/*/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app, _port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}


module.exports = swaggerDocs