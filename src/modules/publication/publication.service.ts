import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreatePublicationDto,
  UpdatePublicationDto,
} from './dto/publication.dto';
import { PublicationRepository } from './publication.repository';
import { ClientSession } from 'mongoose';
import { CategoryRepository } from '../catigories/category.repository';
import { Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/helpers/getQueryDto';

@Injectable()
export class PublicationService {
  constructor(
    private readonly publicationRepository: PublicationRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async createPublication(
    createPublicationDto: CreatePublicationDto,
    session: ClientSession,
  ) {
    let category = await this.categoryRepository.getCategoryById(
      createPublicationDto.categoryId,
    );

    if (!category) {
      throw new InternalServerErrorException(
        `The record with id: ${createPublicationDto.categoryId} does not exist`,
      );
    }

    //можно ли сделать лучше?
    createPublicationDto.categoryId = category;

    return await this.publicationRepository.createPublication(
      createPublicationDto,
      session,
    );
  }

  async getPublication(id: MongooseSchema.Types.ObjectId) {
    return await this.publicationRepository.getPublicationById(id);
  }

  async getPublications(getQueryDto: GetQueryDto) {
    return await this.publicationRepository.getPublications(getQueryDto);
  }

  async updatePublication(
    id: MongooseSchema.Types.ObjectId,
    updatePublicationDto: UpdatePublicationDto,
    session: ClientSession,
  ) {
    try {
      let category = await this.categoryRepository.getCategoryById(
        updatePublicationDto.categoryId,
      );
      updatePublicationDto.categoryId = category;

      return await this.publicationRepository.updatePublication(
        id,
        updatePublicationDto,
        session,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `The record with id: ${updatePublicationDto.categoryId} does not exist`,
        error,
      );
    }
  }

  async deletePublication(
    id: MongooseSchema.Types.ObjectId,
    session: ClientSession,
  ) {
    return await this.publicationRepository.deletePublication(id, session);
  }
}
