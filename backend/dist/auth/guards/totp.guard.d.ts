import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class TotpGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
