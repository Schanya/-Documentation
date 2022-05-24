import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ClientSession, Schema as MongooseSchema } from 'mongoose';
import { GetQueryDto } from 'src/helpers/getQueryDto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession,
  ) {
    return await this.categoryRepository.createCategory(
      createCategoryDto,
      session,
    );
  }

  async getCategoryById(id: MongooseSchema.Types.ObjectId) {
    return await this.categoryRepository.getCategoryById(id);
  }

  async getCategories(getQueryDto: GetQueryDto) {
    return await this.categoryRepository.getCategories(getQueryDto);
  }

  async updateCategory(
    updateCategoryDto: UpdateCategoryDto,
    session: ClientSession,
  ) {
    return await this.categoryRepository.updateCategory(
      updateCategoryDto,
      session,
    );
  }

  async deleteCategory(
    id: MongooseSchema.Types.ObjectId,
    session: ClientSession,
  ) {
    return await this.categoryRepository.deleteCategory(id, session);
  }
}
