import { ExecutionContext } from '@nestjs/common';
declare const OauthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OauthGuard extends OauthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
