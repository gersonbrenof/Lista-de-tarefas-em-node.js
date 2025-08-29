const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Lista de Tarefas",
            version: "1.0.0",
            description: "Documentação da API de Tarefas",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // onde as rotas estão definidas
};

const specs = swaggerJsDoc(options);

function setupSwagger(app) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
