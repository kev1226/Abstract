// Importaciones de NestJS necesarias para la creación de aplicaciones y microservicios.
import { NestFactory } from '@nestjs/core'; // Permite la creación de instancias de aplicaciones NestJS.
import { AppModule } from './app.module'; // Importa el módulo raíz de la aplicación, que configura y organiza diferentes partes de la app.
import { Logger, ValidationPipe } from '@nestjs/common'; // Importa herramientas comunes de NestJS: Logger para registros de actividades y ValidationPipe para la validación de datos.
import { envs } from './config'; // Importa configuraciones como las variables de entorno desde el módulo de configuración.
import { MicroserviceOptions, Transport } from '@nestjs/microservices'; // Importa opciones y transporte para configurar microservicios.

// Función asíncrona bootstrap para configurar e iniciar el microservicio.
async function bootstrap() {
  // Crea una instancia de Logger para registrar eventos y estados del microservicio.
  const logger = new Logger('Main');

  // Crea una instancia del microservicio con configuraciones específicas.
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule, // Módulo raíz que contiene la configuración de la aplicación.
    {
      transport: Transport.TCP, // Define el tipo de transporte, en este caso TCP para la comunicación.
      options: {
        port: envs.port // Establece el puerto de escucha del microservicio usando una variable de entorno.
      }
    }
  );

  // Configura globalmente el ValidationPipe para validar todas las solicitudes entrantes.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo permite datos definidos en los DTOs, descartando cualquier campo adicional no deseado.
      forbidNonWhitelisted: true, // Bloquea la solicitud si contiene campos no permitidos.
    }),
  );

  // Inicia la escucha de conexiones en el puerto configurado.
  await app.listen();
  // Registra un mensaje en el log una vez que el microservicio esté corriendo y escuchando en el puerto especificado.
  logger.log(`Products Microservice running on port ${ envs.port }`);
}

// Llama a la función bootstrap para iniciar el proceso.
bootstrap();
