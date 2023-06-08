import swaggerJsdoc from 'swagger-jsdoc'


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'First Serve API Docs',
      description: 'test',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:8080/',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        BasicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
    },
    security: {
      BasicAuth: [],
    },
  },
  apis: ['./src/swagger/*.yml'],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
