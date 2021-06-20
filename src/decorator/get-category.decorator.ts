import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Account } from "src/entity/account.entity";

export const GetCategory = createParamDecorator((data, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.categories;
});
