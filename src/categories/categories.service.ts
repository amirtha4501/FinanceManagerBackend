import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    
    constructor(
        @InjectRepository(CategoryRepository)
        private categoryRepository: CategoryRepository
    ) {}

    async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryRepository.createCategory(createCategoryDto);
    }

    async getCategoryById(id: number): Promise<Category> {
        const found = await this.categoryRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`Category with ID '${id}' not found`);
        }

        return found;
    }
}
