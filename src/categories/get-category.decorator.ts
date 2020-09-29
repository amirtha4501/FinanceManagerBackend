import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCategory = createParamDecorator((data, ctx: ExecutionContext): Account => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.categories;
});
