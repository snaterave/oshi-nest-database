import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery  } from 'mongoose';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto,FilterProductDto } from './../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  findAll(params?: FilterProductDto) {
    console.log('params: ',params)
    if(params){
      const filters: FilterQuery<Product> = {}; // filter por defecto
      const {limit = 0, offset = 1} = params;
      const { minPrice, maxPrice } = params;

      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }


      return this.productModel
                  .find(filters)
                  .skip(offset*limit)
                  .limit(limit);
    }
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return newProduct.save();
  }

  update(id: string, changes: UpdateProductDto) {
    // {$set:changes} == actualiza solo los atributos que se envian
    // {new:true} == devuelve el objeto con los nuevos cambios
    const product = this.productModel.findByIdAndUpdate(id,{$set:changes},{new:true}).exec();
    if(!product){
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
