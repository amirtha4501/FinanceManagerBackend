import { Type } from "src/type.enum";

export class UpdateCategoryDto {

    name: string;

    parent_name: string;
    
    starred: boolean;

    type: Type;

    color: string;
}
