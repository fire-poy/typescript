import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(): Promise<void>;
    loginRedirect(req: any, res: any): any;
    getStatus(req: any): {
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: string;
    };
    activate2fa(req: any, body: any): Promise<boolean>;
    deactivate2fa(req: any): Promise<boolean>;
    authenticateTOTP(req: any, body: any): Promise<boolean>;
    generateQR(req: any): Promise<any>;
}
