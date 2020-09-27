import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

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
}
