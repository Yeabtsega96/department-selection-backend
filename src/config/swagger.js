
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Department Selection API",
      version: "1.0.0",
      description:
        "API documentation for the University Department Selection System.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "better-auth.session_token",
          description: "Better Auth session cookie.",
        },
      },
    },
  },

  apis: [
    "./src/modules/**/*.js",
    "./src/routes/**/*.js",
    "./src/config/swagger.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
