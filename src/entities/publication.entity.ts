import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Category } from './category.entity';

@Schema()
export class Publication extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  textContent: string;

  @Prop({ required: true })
  code: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Category.name })
  categoryId: MongooseSchema.Types.ObjectId;
}

export const PublicationSchema = SchemaFactory.createForClass(Publication);
