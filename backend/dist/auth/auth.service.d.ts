import { User } from '../types/User';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private userService;
    constructor(userService: UserService);
    validateUser(user42: any): Promise<import("src/typeorm/user.entity").User>;
    generateTwoFactorAuthenticationSecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    findUser(ft_id: number): Promise<any>;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<any>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, User: User): boolean;
    authenticateTOTP(req: any, body: any): Promise<boolean>;
    activate2fa(req: any, body: any): Promise<boolean>;
    deactivate2fa(req: any): Promise<boolean>;
    generateQR(req: any): Promise<any>;
}
