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
        const parent = await this.findOne({ where: { name: parent_name} });
         
        category.name = name;
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
            if(error.code === '23505') {
                throw new ConflictException("category already exists");
            } else {
                throw new InternalServerErrorException();
            }
        }
        return category;
    }
}
