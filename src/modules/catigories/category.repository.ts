import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/entities/category.entity';
import { ClientSession, Schema as MongooseSchema, Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import {
  ConflictException,
  Delete,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetQueryDto } from 'src/helpers/getQueryDto';
import { ResponseDto } from 'src/helpers/responsDto';

export class CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    session: ClientSession,
  ) {
    let category = await this.getCategoryByName(Category.name);

    if (!category) {
      throw new ConflictException('Category with such name exists!');
    }

    category = new this.categoryModel({
      name: createCategoryDto.name,
      code: createCategoryDto.code,
    });

    try {
      category = await category.save({ session });
    } catch (error) {
      throw new InternalServerErrorException('Error querying the DB', error);
    }

    return category;
  }

  async getCategories(query: GetQueryDto) {
    let from = query.from || 0;
    from = Number(from);

    let limit = query.limit || 0;
    limit = Number(limit);

    let categories: Category[];

    try {
      if (limit === 0) {
        categories = await this.categoryModel
          .find()
          .skip(from)
          .sort({ createdAt: -1 })
          .exec();
      } else {
        categories = await this.categoryModel
          .find()
          .skip(from)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec();
      }

      let response: ResponseDto;

      if (categories.length > 0) {
        response = {
          ok: true,
          data: categories,
          message: 'Get categories Ok!',
        };
      } else {
        response = {
          ok: true,
          data: [],
          message: 'Can not get categories',
        };
      }
      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error when trying to query categories',
        error,
      );
    }
  }

  async getCategoryById(id: MongooseSchema.Types.ObjectId) {
    let category;
    try {
      category = await this.categoryModel.findById(id).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `The record with id: ${id} does not exist`,
        error,
      );
    }

    /* if (!category) {
      throw new NotFoundException('The client with this id does not exist');
    }*/

    return category;
  }

  async getCategoryByName(name: string): Promise<Category> {
    try {
      let category: any = await this.categoryModel.find({ name });

      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error connecting to MongoDB',
        error,
      );
    }
  }

  async updateCategory(
    updateCategory: UpdateCategoryDto,
    session: ClientSession,
  ) {
    const actualDate = new Date();
    actualDate.toUTCString();

    const updateData = {
      name: updateCategory.name,
      code: updateCategory.code,
      updatedAt: actualDate,
    };

    try {
      let category: any = await this.categoryModel
        .findOneAndUpdate({ _id: updateCategory.id }, updateData, { new: true })
        .session(session)
        .exec();

      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error trying to update product',
        error,
      );
    }
  }

  async deleteCategory(
    id: MongooseSchema.Types.ObjectId,
    session: ClientSession,
  ) {
    let category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(
        `The client with this id: ${id} does not exist`,
      );
    }

    const deleted = await this.categoryModel.findByIdAndRemove(id, { session });

    return deleted;
  }
}
