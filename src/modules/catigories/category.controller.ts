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
import { Connection, Schema as MongooseSchema } from 'mongoose';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Response } from 'express';
import { GetQueryDto } from 'src/helpers/getQueryDto';

@Controller('category')
export class CategoryController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private categoryService: CategoryService,
  ) {}

  @Post('/createCategory')
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newCategory = await this.categoryService.createCategory(
        createCategoryDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.CREATED).send(newCategory);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  @Get('/getCategoryById/:id')
  async getCategoryById(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const category: any = await this.categoryService.getCategoryById(id);
    return res.status(HttpStatus.OK).send(category);
  }

  @Get('/getCategories')
  async getCategories(@Query() getQueryDto: GetQueryDto, @Res() res: Response) {
    const categories: any = await this.categoryService.getCategories(
      getQueryDto,
    );
    return res.status(HttpStatus.OK).send(categories);
  }

  @Put('/updateCategory/:id')
  async updateCategory(
    @Param('id') id: MongooseSchema.Types.ObjectId,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();
    try {
      const newCategory: any = await this.categoryService.updateCategory(
        updateCategoryDto,
        session,
      );
      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(newCategory);
    } catch (error) {
      session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  @Delete('/:id')
  async deleteCategory(
    @Param('id') categoryId: MongooseSchema.Types.ObjectId,
    @Res() res: Response,
  ) {
    const session = await this.mongoConnection.startSession();
    session.startTransaction();

    try {
      const category = await this.categoryService.deleteCategory(
        categoryId,
        session,
      );
      await session.commitTransaction();

      return res.status(HttpStatus.OK).json({
        message: 'Customer has been deleted',
        category,
      });
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }
}
