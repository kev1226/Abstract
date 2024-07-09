// Importa el decorador Module de NestJS, necesario para definir un módulo.
import { Module } from '@nestjs/common';
// Importa la clase ProductsService, que contiene la lógica de negocio para la gestión de productos.
import { ProductsService } from './products.service';
// Importa la clase ProductsController, que maneja las rutas y las solicitudes HTTP para las operaciones sobre productos.
import { ProductsController } from './products.controller';

/**
 * Define un módulo NestJS para la gestión de productos.
 * Este módulo agrupa y organiza todo lo relacionado con productos, incluyendo los controladores y los proveedores de servicios.
 */
@Module({
  controllers: [ProductsController], // Registra ProductsController para manejar las rutas de productos.
  providers: [ProductsService], // Registra ProductsService para inyectar servicios relacionados con productos en el controlador.
})
// Exporta la clase ProductsModule para permitir su uso en otras partes de la aplicación.
export class ProductsModule {}
