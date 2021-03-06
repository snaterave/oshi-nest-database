import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  ValidateIf, // valida si otro atributo está validando
  ValidateNested, // validar en cascada
  IsMongoId,
  IsArray
} from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer'; 
import { CreateSubDocDto } from './sub-doc.dto'; 

import { CreateCategoryDto } from './category.dtos';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: `product's name` })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @ApiProperty()
  readonly price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  readonly stock: number;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  readonly image: string;

  // relacion uno a uno (cada producto tiene una categoría)
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty()
  readonly category: CreateCategoryDto; 

  // relacion uno a uno referenciando un objectId
  @IsNotEmpty()
  @IsMongoId()
  readonly brand: string; 

  @IsNotEmpty()
  @ValidateNested()
  readonly subDoc: CreateSubDocDto;  //  1:1

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDocDto)
  readonly subDocs: CreateSubDocDto[];  //  1:N
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductDto{
  @IsOptional()
  @IsPositive()
  limit:number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  @Min(0)
  minPrice: number;

  @ValidateIf((params) => params.minPrice)
  @IsPositive()
  maxPrice: number;

}