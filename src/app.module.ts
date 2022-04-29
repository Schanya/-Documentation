import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/catigories/category.module';
import { PublicationModule } from './modules/publication/publication.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/documentation'),
    PublicationModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
