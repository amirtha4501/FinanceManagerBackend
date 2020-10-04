import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Category } from "./category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    async createCategory(
        createCategoryDto: CreateCategoryDto,
        user: User
    ): Promise<Category> {
        const { name, parent_name, starred, type, color } = createCategoryDto;

        const category = new Category();
        const parent = await this.findOne({ where: { name: parent_name, user: user} });
        
        if(!await this.findOne({where: {name: name, user: user}})) {
            category.name = name;
        } else {
            throw new ConflictException("category name already exists");
        }
        if(parent) {
            category.parent_id = parent.id;
        }
        category.starred = starred;
        category.type = type;
        category.color = color;
        category.user = user;

        try {
            await category.save();
        } catch (error) {
            throw new InternalServerErrorException();
        }
        return category;
    }

    async getCategories(user: User): Promise<Category[]> {
        const query = this.createQueryBuilder('category');

        const userId = user.id;
        query.andWhere('category.user = :userId', { userId });
       
        const categories = await query.getMany();
        return categories;
    }

}
