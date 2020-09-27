import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
    
    constructor(
        @InjectRepository(CategoryRepository)
        private categoryRepository: CategoryRepository
    ) {}

    async createCategory(
        createCategoryDto: CreateCategoryDto,
        user: User
    ): Promise<Category> {
        return this.categoryRepository.createCategory(createCategoryDto, user);
    }

    async getCategoryById(
        id: number,
        user: User
    ): Promise<Category> {
        const found = await this.categoryRepository.findOne({ where: { user: user, id: id } });

        if(!found) {
            throw new NotFoundException(`Category with ID '${id}' not found`);
        }

        return found;
    }
}
