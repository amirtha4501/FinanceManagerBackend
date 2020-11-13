import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({ bodyLimit: 10048576 }),
    )
    app.enableCors();
    await app.listen(+process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
