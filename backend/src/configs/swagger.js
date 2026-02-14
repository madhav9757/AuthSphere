import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { conf } from "./env.js";
import logger from "../utils/logger.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AuthSphere API",
      version: "1.0.0",
      description: "API documentation for AuthSphere Backend and SDK",
    },
    servers: [
      {
        url: `${conf.baseUrl}/api/v1`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/docs/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  logger.info(`Swagger Docs available at ${conf.baseUrl}/api-docs`);
};
