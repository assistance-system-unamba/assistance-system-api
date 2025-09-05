// src/config/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header', name: 'Authorization' },
      'bearer',
    )
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  (doc as any).security = [{ bearer: [] }]; // aplica Bearer a TODAS las operaciones

  SwaggerModule.setup('docs', app, doc, {
    swaggerOptions: { persistAuthorization: true },
  });
}
