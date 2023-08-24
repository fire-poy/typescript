"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../typeorm/user.entity");
const friend_service_1 = require("../friend/friend.service");
const friend_module_1 = require("../friend/friend.module");
const friend_entity_1 = require("../typeorm/friend.entity");
const channel_entity_1 = require("../typeorm/channel.entity");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, friend_entity_1.Friend, channel_entity_1.Channel]),
            (0, common_1.forwardRef)(() => friend_module_1.FriendModule),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, friend_service_1.FriendService],
        exports: [user_service_1.UserService, typeorm_1.TypeOrmModule],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map