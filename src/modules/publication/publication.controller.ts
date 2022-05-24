import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import { PublicationService } from './publication.service';
import { Response } from 'express';
import { Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/helpers/getQueryDto';

@Controller('publication')
export class PublicationController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private publicationService: PublicationService,
  ) {}

  @Post()
  async createPublication(
    @Body() createPublicationDto: CreatePublicationDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const newPublication = await this.publicationService.createPublication(
        createPublicationDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newPublication);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  //нужно ли при получении публикации вытягивать её категорию?
  @Get('/:id')
  async getPublication(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const publication: any = await this.publicationService.getPublication(id);

    return res.status(HttpStatus.OK).send(publication);
  }

  @Get()
  async getPublications(
    @Query() GetQueryDto: GetQueryDto,
    @Res() res: Response,
  ) {
    const publications: any = await this.publicationService.getPublications(
      GetQueryDto,
    );

    return res.status(HttpStatus.OK).send(publications);
  }

  @Put('/:id')
  async updatePublication(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updatePublicationDto: UpdatePublicationDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newPublication: any =
        await this.publicationService.updatePublication(
          id,
          updatePublicationDto,
          session,
        );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(newPublication);
    } catch (error) {
      session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  @Delete('/:id')
  async deletePublication(
    @Param('id') publicationId: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const publication = await this.publicationService.deletePublication(
        publicationId,
        session,
      );

      await session.commitTransaction();

      return res.status(HttpStatus.OK).json({
        message: 'Publication has been deleted',
        publication,
      });
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }
}
