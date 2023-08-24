import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';
declare const Auth42Strategy_base: new (...args: any[]) => any;
export declare class Auth42Strategy extends Auth42Strategy_base {
    private userService;
    private authService;
    constructor(userService: UserService, authService: AuthService);
    validate(accessToken: string): Promise<any>;
    private getUserProfile;
}
export {};
