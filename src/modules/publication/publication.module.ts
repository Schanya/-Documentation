import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/entities/category.entity';
import { CategoryModule } from '../catigories/category.module';
import {
  Publication,
  PublicationSchema,
} from 'src/entities/publication.entity';

@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: Publication.name, schema: PublicationSchema },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PublicationModule {}
