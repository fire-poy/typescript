"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth42Strategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_oauth2_1 = require("passport-oauth2");
const user_service_1 = require("../../user/user.service");
const auth_service_1 = require("../auth.service");
let Auth42Strategy = class Auth42Strategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, 'oauth') {
    constructor(userService, authService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.FT_UUID,
            clientSecret: process.env.FT_SECRET,
            callbackURL: `${process.env.URL_BACKEND}/api/auth/42/redirect`,
        });
        this.userService = userService;
        this.authService = authService;
    }
    async validate(accessToken) {
        try {
            const user = await this.getUserProfile(accessToken);
            if (!user) {
                throw new common_1.UnauthorizedException();
            }
            const new_user = await this.authService.validateUser(user);
            return new_user;
        }
        catch (error) {
            if (error.response &&
                error.response.status === 'already_connected') {
                return {
                    redirect: `${process.env.URL_FRONTEND}?error=already_connected`,
                };
            }
            throw error;
        }
    }
    async getUserProfile(accessToken) {
        const res = await fetch('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch user profile from 42 API: ${res.status}`);
        }
        const data = await res.json();
        return {
            nickname: data.login,
            avatarUrl: data.image.versions.small,
            FT_id: data.id,
        };
    }
};
Auth42Strategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], Auth42Strategy);
exports.Auth42Strategy = Auth42Strategy;
//# sourceMappingURL=auth42.strategy.js.map