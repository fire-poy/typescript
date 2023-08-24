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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const user_service_1 = require("../user/user.service");
const qrcode_1 = require("qrcode");
const user_entity_1 = require("../typeorm/user.entity");
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
let AuthService = class AuthService {
    constructor(userService) {
        this.userService = userService;
    }
    async validateUser(user42) {
        let user = await this.userService.findByFT_id(user42.FT_id);
        if (!user) {
            let newNickname = user42.nickname;
            const userSameNickname = await this.userService.findByNickname(user42.nickname);
            if (userSameNickname)
                newNickname = generateRandomString();
            user = await this.userService.create({
                FT_id: user42.FT_id,
                nickname: newNickname,
                avatarUrl: user42.avatarUrl,
                status: user_entity_1.UserStatus.Online,
            });
        }
        else if (user.status !== user_entity_1.UserStatus.Offline) {
            throw new common_1.UnauthorizedException('already_connected');
        }
        else {
            await this.userService.changeStatusOnLine(user.id);
        }
        return user;
    }
    async generateTwoFactorAuthenticationSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(user.nickname, 'COSMIC_PONG', secret);
        await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {
            secret,
            otpauthUrl,
        };
    }
    async findUser(ft_id) {
        let user = await this.userService.findOne(ft_id);
        return user;
    }
    async generateQrCodeDataURL(otpAuthUrl) {
        return (0, qrcode_1.toDataURL)(otpAuthUrl);
    }
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, User) {
        return otplib_1.authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: User.TFASecret,
        });
    }
    async authenticateTOTP(req, body) {
        const user = await this.userService.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCodeValid = this.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        req.session.needTFA = false;
        return true;
    }
    async activate2fa(req, body) {
        const user = await this.userService.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCodeValid = this.isTwoFactorAuthenticationCodeValid(body.twoFactorAuthenticationCode, user);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        this.userService.turnOnTwoFactorAuthentication(user.id);
        req.user.TFAEnabled = true;
        return true;
    }
    async deactivate2fa(req) {
        const user = await this.userService.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        this.userService.turnOffTwoFactorAuthentication(user.id);
        req.user.TFAEnabled = false;
        return true;
    }
    async generateQR(req) {
        const user = await this.userService.findOne(req.user.id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const secretAndUrl = await this.generateTwoFactorAuthenticationSecret(user);
        const qrCode = await this.generateQrCodeDataURL(secretAndUrl.otpauthUrl);
        return qrCode;
    }
};
__decorate([
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "authenticateTOTP", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "activate2fa", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "deactivate2fa", null);
__decorate([
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "generateQR", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map