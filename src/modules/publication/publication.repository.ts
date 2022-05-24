import { InjectModel } from '@nestjs/mongoose';
import { Publication } from 'src/entities/publication.entity';
import { ClientSession, Schema as MongooseSchema, Model } from 'mongoose';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import {
  InternalServerErrorException,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { GetQueryDto } from 'src/helpers/getQueryDto';
import { ResponseDto } from 'src/helpers/responsDto';

export class PublicationRepository {
  constructor(
    @InjectModel(Publication.name)
    private readonly publicationModel: Model<Publication>,
  ) {}
  async createPublication(
    createPublicationDto: CreatePublicationDto,
    session: ClientSession,
  ) {
    let publication = new this.publicationModel({
      name: createPublicationDto.name,
      textContent: createPublicationDto.textContent,
      code: createPublicationDto.code,
      categoryId: createPublicationDto.categoryId,
    });

    try {
      publication = await publication.save({ session });
    } catch (error) {
      throw new InternalServerErrorException('Error querying the DB', error);
    }

    return publication;
  }

  async getPublicationById(id: MongooseSchema.Types.ObjectId) {
    try {
      let publication = await this.publicationModel.findById(id).exec();

      return publication;
    } catch (error) {
      throw new InternalServerErrorException(
        `The record with ${id} does not exist`,
        error,
      );
    }
  }

  async getPublications(query: GetQueryDto) {
    let from = query.from || 0;
    from = Number(from);

    let limit = query.limit || 0;
    limit - Number(limit);

    let publications: Publication[];

    try {
      if (limit == 0) {
        publications = await this.publicationModel
          .find()
          .skip(from)
          .sort({ createdAt: -1 })
          .exec();
      } else {
        publications = await this.publicationModel
          .find()
          .skip(from)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec();
      }

      let response: ResponseDto;

      if (publications.length > 0) {
        response = {
          ok: true,
          data: publications,
          message: 'Successfully received publications',
        };
      } else {
        response = {
          ok: true,
          data: [],
          message: 'Did not get publications',
        };
      }

      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error when trying to query publications',
        error,
      );
    }
  }

  async updatePublication(
    id: MongooseSchema.Types.ObjectId,
    updatePublication: UpdatePublicationDto,
    session: ClientSession,
  ) {
    const actualDate = new Date();
    actualDate.toISOString();

    const updateData = {
      name: updatePublication.name,
      textContent: updatePublication.textContent,
      code: updatePublication.code,
      categoryId: updatePublication.categoryId,
    };

    try {
      let publication = await this.publicationModel
        .findOneAndUpdate({ _id: id }, updateData, {
          new: true,
        })
        .session(session)
        .exec();

      return publication;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error trying to update product',
        error,
      );
    }
  }

  async deletePublication(
    id: MongooseSchema.Types.ObjectId,
    session: ClientSession,
  ) {
    let publication = await this.publicationModel.findById(id).exec();

    if (!publication) {
      throw new NotFoundException(
        'The publication with this id does not exist',
      );
    }

    const deleted = await this.publicationModel.findByIdAndRemove(id, {
      session,
    });

    return deleted;
  }
}
