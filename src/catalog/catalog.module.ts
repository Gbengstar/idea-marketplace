import { Module } from '@nestjs/common';
import { CatalogController } from './controller/catalog.controller';
import { CategoryService } from './service/category.service';
import { SubCategoryService } from './service/sub-category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './model/category.model';
import { SubCategory, SubCategorySchema } from './model/sub-category.model';
import { FileUploadModule } from '../../libs/utils/src/file-upload/file-upload.module';

@Module({
  controllers: [CatalogController],
  providers: [CategoryService, SubCategoryService],
  imports: [
    FileUploadModule,
    MongooseModule.forFeatureAsync([
      { name: Category.name, useFactory: () => CategorySchema },
      { name: SubCategory.name, useFactory: () => SubCategorySchema },
    ]),
  ],
})
export class CatalogModule {}
