import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

/**
 * Controlador que gestiona las operaciones CRUD para productos en una arquitectura de microservicios.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Maneja la creación de un producto recibiendo datos a través de un patrón de mensajes.
   * @param createProductDto DTO con los datos necesarios para crear un producto.
   * @returns La creación del producto.
   */
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * Recupera todos los productos aplicando paginación, basado en un patrón de mensajes.
   * @param paginationDto DTO que contiene parámetros de paginación.
   * @returns Una lista de productos paginada.
   */
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  /**
   * Busca un producto específico por su ID utilizando un patrón de mensajes.
   * @param id El ID del producto a buscar.
   * @returns El producto si es encontrado.
   */
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * Actualiza un producto existente basado en un patrón de mensajes.
   * @param updateProductDto DTO que contiene el ID del producto y los datos a actualizar.
   * @returns El producto actualizado.
   */
  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  /**
   * Elimina un producto específico utilizando un patrón de mensajes.
   * @param id El ID del producto a eliminar.
   * @returns El resultado de la operación de eliminación.
   */
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
