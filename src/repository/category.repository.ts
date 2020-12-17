import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "src/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Category } from "../entity/category.entity";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { id } from "date-fns/locale";

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {

    async createDefaultCategories(user: User): Promise<void> {
        
        const categories: any[] = [
            // food
            {
                name: "food",
                parent_name: null,
                starred: false,
                type: "expense",
                color: "red"
            },
            {
                name: "food general",
                parent_name: "food",
                starred: false,
                type: "expense",
                color: "#fa2525"
            },
            {
                name: "supermarket",
                parent_name: "food",
                starred: false,
                type: "expense",
                color: "#fc4242"
            },
            {
                name: "restaurant",
                parent_name: "food",
                starred: false,
                type: "expense",
                color: "#fa5757"
            },
            {
                name: "every day",
                parent_name: "food",
                starred: false,
                type: "expense",
                color: "#fc6d6d"
            },

            // entertainment
            {
                name: "entertainment",
                parent_name: null,
                starred: false,
                type: "expense",
                color: "green"
            },
            {
                name: "entertainment general",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#0ee602"
            },
            {
                name: "cinema and theatre",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#3de034"
            },
            {
                name: "disco",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#3de034"
            },
            {
                name: "bar",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#55db4d"
            },
            {
                name: "holiday",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#63db5c"
            },
            {
                name: "concert",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#70d96a"
            },
            {
                name: "games",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#81d67c"
            },
            {
                name: "trips",
                parent_name: "entertainment",
                starred: false,
                type: "expense",
                color: "#97fa91"
            },
        ];

        for(let i = 0; i < categories.length; i++) {
            const category = new Category();

            const parent = await this.findOne({ where: {name: categories[i].parent_name, user: user} });
                
            if(parent) {
                category.parent_id = parent.id;
            }
            category.name = categories[i].name;
            category.starred = categories[i].starred;
            category.type = categories[i].type;
            category.color = categories[i].color;
            category.user = user;

            try {
                await category.save();
            } catch (error) {
                throw new InternalServerErrorException("Default category creation failed");
            }
        }
    }

    async createCategory(
        createCategoryDto: CreateCategoryDto,
        user: User
    ): Promise<Category> {
        const { name, parent_name, starred, type, color } = createCategoryDto;

        const category = new Category();
        const parent = await this.findOne({ where: {name: parent_name, user: user} });
        
        if(!await this.findOne({where: {name: name, user: user}})) {
            category.name = name;
        } else {
            throw new ConflictException("category name already exists");
        }
        if(parent) {
            category.parent_id = parent.id;
        }
        if(starred) {
            category.starred = starred;
        } else {
            category.starred = false;
        }
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
        let items: any[] = [];

        for (let i = 0; i < categories.length; i++) {

            if(categories[i].parent_id === null) {
                let parent: any = {
                    id: categories[i].id,
                    name: categories[i].name,
                    parent_id: categories[i].parent_id,
                    starred: categories[i].starred,
                    type: categories[i].type,
                    color: categories[i].color,
                    subCategories: []
                }
                items.push(parent);
            } else {
                let child: any = {
                    id: categories[i].id,
                    name: categories[i].name,
                    parent_id: categories[i].parent_id,
                    starred: categories[i].starred,
                    type: categories[i].type,
                    color: categories[i].color
                }

                for (let i = 0; i < items.length; i++) {
                    if(child.parent_id === items[i].id) {
                        items[i].subCategories.push(child);
                    }
                }
            }
        }
        return items;
    }

}
