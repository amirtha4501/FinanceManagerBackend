import { ConflictException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

    async getCategories(user: User): Promise<Category[]> {
        return this.categoryRepository.getCategories(user);
    }

    async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto, user: User): Promise<Category> {
        const category = await this.getCategoryById(id, user);
        const { name, parent_name, starred, type, color } = updateCategoryDto;
        
        const parent = await this.categoryRepository.findOne({ where: { name: parent_name, user: user} });

        if(!await this.categoryRepository.findOne({where: {name: name, user: user}})) {
            category.name = name;
        } else {
            throw new ConflictException("category name already exists");
        }
        category.parent_id = parent.id;
        category.starred = starred;
        category.type = type;
        category.color = color;

        await category.save();
        return category;
    }

    async deleteCategory(id: number, user: User): Promise<void> {
        const category = await this.getCategoryById(id, user);
        const result = await this.categoryRepository.delete(category.id);
        
        if(result.affected === 0) {
            throw new NotFoundException(`Category with ID '${id} not found to delete`);
        }
    }

}
