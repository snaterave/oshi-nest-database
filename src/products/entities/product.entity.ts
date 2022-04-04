import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from './brand.entity';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, index: true })
  price: number;

  @Prop({ type: Number })
  stock: number;

  @Prop()
  image: string;

  // documento embebido
  @Prop(
    raw({
      name: { type: String },
      image: { type: String },
    }),
  )
  category: Record<string, any>; 
  
  // referencia uno a un por id
  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand: Brand | Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
// Indice compuesto. 1 = orden ascendente; -1 = orden descendente
ProductSchema.index({ price: 1, stock: -1 }); 