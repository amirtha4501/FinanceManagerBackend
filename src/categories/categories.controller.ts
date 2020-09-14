import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
     
    constructor(
        private categoriesService: CategoriesService
    ) {}
    
    @Post()
    @UsePipes(ValidationPipe)
    createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoriesService.createCategory(createCategoryDto);
    }

    @Get('/:id')
    getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        return this.categoriesService.getCategoryById(id);
    }
}
