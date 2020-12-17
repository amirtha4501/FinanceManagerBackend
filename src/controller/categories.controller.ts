import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { CategoriesService } from '../service/categories.service';
import { Category } from '../entity/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoriesController {
    
    constructor(
        private categoriesService: CategoriesService
    ) {}
   
    @Post()
    @UsePipes(ValidationPipe)
    createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @GetUser() user: User 
    ): Promise<Category> {
        return this.categoriesService.createCategory(createCategoryDto, user);
    }

    @Get('/:id')
    getCategoryById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User 
    ): Promise<Category> {
        return this.categoriesService.getCategoryById(id, user);
    }

    @Get()
    getCategories(
        @GetUser() user: User    
    ): Promise<Category[]> {
        return this.categoriesService.getCategories(user);
    }

    @Patch('/:id')
    updateCategory(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateCategoryDto: UpdateCategoryDto,
        @GetUser() user: User    
    ): Promise<Category> {
        return this.categoriesService.updateCategory(id, updateCategoryDto, user);
    }
    
    @Delete('/:id') 
    deleteCategory(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User    
    ): Promise<void> {
        return this.categoriesService.deleteCategory(id, user);
    }
}
