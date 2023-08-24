import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class Activate2faGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
