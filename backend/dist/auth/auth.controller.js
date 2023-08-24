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
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const oauth_guard_1 = require("./guards/oauth.guard");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const totp_guard_1 = require("./guards/totp.guard");
const activate2fa_guard_1 = require("./guards/activate2fa.guard");
const user_service_1 = require("../user/user.service");
const public_decorator_1 = require("../decorators/public.decorator");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login() { }
    loginRedirect(req, res) {
        if (req.session.needTFA === true)
            res.redirect(`${process.env.URL_FRONTEND}/TFAVerify`);
        else
            res.redirect(`${process.env.URL_FRONTEND}/profile`);
        return req.user;
    }
    getStatus(req) {
        return this.userService.logStatus(req);
    }
    async activate2fa(req, body) {
        return await this.authService.activate2fa(req, body);
    }
    async deactivate2fa(req) {
        return await this.authService.deactivate2fa(req);
    }
    async authenticateTOTP(req, body) {
        return await this.authService.authenticateTOTP(req, body);
    }
    async generateQR(req) {
        return await this.authService.generateQR(req);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)(oauth_guard_1.OauthGuard),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('42/redirect'),
    (0, common_1.UseGuards)(oauth_guard_1.OauthGuard),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "loginRedirect", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('loginStatus'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getStatus", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('2fa/turn-on'),
    (0, common_1.UseGuards)(activate2fa_guard_1.Activate2faGuard),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "activate2fa", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('2fa/turn-off'),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deactivate2fa", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('2fa/authenticate'),
    (0, common_1.UseGuards)(totp_guard_1.TotpGuard),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateTOTP", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('2fa/generate'),
    (0, common_1.UseGuards)(activate2fa_guard_1.Activate2faGuard),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateQR", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map