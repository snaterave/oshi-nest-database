import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from './brand.entity';
import { SubDoc, SubDocSchema } from './sub-doc.entity'; 

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

  // documento embebido. Relación 1:1
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

  @Prop({ type: SubDocSchema })
  subDoc: SubDoc;

  @Prop({ type: [SubDocSchema] })
  subDocs: Types.Array<SubDoc>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
// Indice compuesto. 1 = orden ascendente; -1 = orden descendente
ProductSchema.index({ price: 1, stock: -1 }); 