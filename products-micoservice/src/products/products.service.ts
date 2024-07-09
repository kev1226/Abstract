import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

/**
 * Servicio encargado de gestionar las operaciones CRUD de productos.
 * Extiende de PrismaClient para facilitar el acceso y manejo de la base de datos.
 */
@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  /**
   * Método que se ejecuta al inicializar el módulo.
   * Establece la conexión a la base de datos y registra un mensaje de confirmación.
   */
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  /**
   * Crea un nuevo producto utilizando los datos proporcionados en el DTO.
   * @param createProductDto DTO que contiene los datos necesarios para la creación del producto.
   * @returns El producto creado.
   */
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  /**
   * Recupera todos los productos disponibles, aplicando paginación.
   * @param paginationDto DTO que contiene los parámetros de paginación.
   * @returns Un objeto que incluye los datos de los productos y metadatos de paginación.
   */
  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true }
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    };
  }

  /**
   * Busca un producto específico por su ID.
   * @param id El ID del producto a buscar.
   * @returns El producto encontrado.
   * @throws RpcException si el producto no se encuentra.
   */
  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true }
    });
    if (!product) {
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }
    return product;
  }

  /**
   * Actualiza los datos de un producto existente.
   * @param id El ID del producto a actualizar.
   * @param updateProductDto DTO con los datos actualizados para el producto.
   * @returns El producto actualizado.
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: data,
    });
  }

  /**
   * Elimina un producto marcándolo como no disponible en lugar de borrarlo de la base.
   * @param id El ID del producto a eliminar.
   * @returns El producto actualizado como no disponible.
   */
  async remove(id: number) {
    await this.findOne(id);
    return this.product.update({
      where: { id },
      data: { available: false }
    });
  }
}
