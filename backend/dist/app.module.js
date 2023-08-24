"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const user_entity_1 = require("./typeorm/user.entity");
const message_entity_1 = require("./typeorm/message.entity");
const friend_entity_1 = require("./typeorm/friend.entity");
const match_entity_1 = require("./typeorm/match.entity");
const friend_module_1 = require("./friend/friend.module");
const match_module_1 = require("./match/match.module");
const auth_module_1 = require("./auth/auth.module");
const pong_module_1 = require("./pong/pong.module");
const authenticated_guard_1 = require("./auth/guards/authenticated.guard");
const core_1 = require("@nestjs/core");
const room_module_1 = require("./room/room.module");
const chat_module_1 = require("./chat/chat.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                ignoreEnvFile: true,
                cache: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: true,
                entities: [user_entity_1.User, friend_entity_1.Friend, match_entity_1.Match],
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, message_entity_1.Message, friend_entity_1.Friend, match_entity_1.Match]),
            user_module_1.UserModule,
            friend_module_1.FriendModule,
            match_module_1.MatchModule,
            auth_module_1.AuthModule,
            pong_module_1.PongModule,
            chat_module_1.ChatModule,
            room_module_1.RoomModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: authenticated_guard_1.AuthenticatedGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map