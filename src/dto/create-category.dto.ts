import { IsNotEmpty } from "class-validator";
import { Type } from "src/type.enum";

export class CreateCategoryDto {
    
    @IsNotEmpty()
    name: string;

    parent_name: string;

    starred: boolean;

    type: Type;

    color: string;

    user_id: number;
}