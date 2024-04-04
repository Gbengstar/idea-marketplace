import { SubCategoryService } from './../service/sub-category.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { Category } from '../model/category.model';
import { FilterQuery, PipelineStage, Types } from 'mongoose';
import { ObjectValidationPipe } from '../../../libs/utils/src/pipe/validation.pipe';
import {
  idValidator,
  idsValidator,
} from '../../../libs/utils/src/validator/custom.validator';
import { SubCategory } from '../model/sub-category.model';
import { IDDto, IDsDto } from '../../../libs/utils/src/dto/id.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../../../libs/utils/src/file-upload/service/file-upload.service';

@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);
  constructor(
    private readonly categoryService: CategoryService,
    private readonly subCategoryService: SubCategoryService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('category')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5000000 },
    }),
  )
  async createCategory(
    @Body() category: Category,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const upload = await this.fileUploadService.fileUploadMany(
      [file],
      'assets',
    );

    if (!upload[0])
      throw new BadRequestException('please upload an icon for category');
    category.icon = upload[0].location;

    return this.categoryService.create(category);
  }

  @Get('category')
  getCategory(@Query('id') id: string) {
    const filter: FilterQuery<Category> = {};
    if (id) filter._id = new Types.ObjectId(id);

    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'category',
          as: 'subcategories',
          pipeline: [{ $sort: { position: -1 } }],
        },
      },
    ];
    return this.categoryService.aggregate(pipeline);
  }

  @Patch('category')
  updateCategory(
    @Body() category: Category,
    @Query(new ObjectValidationPipe(idValidator)) { id }: IDDto,
  ) {
    return this.categoryService.findOneAndUpdateOrErrorOut(
      { _id: id },
      category,
    );
  }

  @Delete('category')
  deleteCategory(
    @Query(new ObjectValidationPipe(idsValidator.required())) { ids }: IDsDto,
  ) {
    this.logger.log({ ids });
    return this.categoryService.deleteMany({ _id: { $in: ids } });
  }

  @Post('sub-category')
  createSubCategory(@Body() subCategory: SubCategory) {
    return this.subCategoryService.create(subCategory);
  }

  @Get('sub-category')
  getSubCategory(@Query() query: any) {
    const filter: FilterQuery<SubCategory> = {};
    if (query.id) filter._id = query.id;
    if (query.category) filter.category = query.category;
    return this.subCategoryService.find(filter);
  }

  @Patch('sub-category')
  updateSubCategory(
    @Body() subCategory: SubCategory,
    @Query(new ObjectValidationPipe(idValidator.required())) { id }: IDDto,
  ) {
    return this.subCategoryService.findOneAndUpdateOrErrorOut(
      { _id: id },
      subCategory,
    );
  }

  @Delete('sub-category')
  deleteSubCategory(
    @Query(new ObjectValidationPipe(idsValidator)) { ids }: IDsDto,
  ) {
    return this.subCategoryService.deleteMany({ _id: { $in: ids } });
  }
}
