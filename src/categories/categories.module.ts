import { Module } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CategoriesController } from '../controller/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '../repository/category.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    AuthModule
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
