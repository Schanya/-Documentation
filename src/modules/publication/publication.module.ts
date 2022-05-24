import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/entities/category.entity';
import { CategoryModule } from '../catigories/category.module';
import {
  Publication,
  PublicationSchema,
} from 'src/entities/publication.entity';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { PublicationRepository } from './publication.repository';

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
  controllers: [PublicationController],
  providers: [PublicationService, PublicationRepository],
  exports: [PublicationService, PublicationRepository],
})
export class PublicationModule {}
