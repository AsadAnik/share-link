import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: `${process.env.APP_DISPLAY_NAME} Api Docs`,
        version: '1.0',
        description:
          'This api docs serve the purpose of the API support for web UI and mobile app',
        contact: {
          name: `${process.env.APP_DISPLAY_NAME} API Support`,
          url: process.env.NEXT_PUBLIC_API_URL,
          email: 'sunoapp92@gmail.com',
        },
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [],
      servers: [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}`,
          description: `${process.env.APP_DISPLAY_NAME} api server`,
        },
      ],
    },
    schemaFolders: ['lib/swagger'],
  });
  return spec;
};
