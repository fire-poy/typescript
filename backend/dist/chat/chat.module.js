"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const chat_gateway_1 = require("./chat.gateway");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("../typeorm/message.entity");
const channel_entity_1 = require("../typeorm/channel.entity");
const user_entity_1 = require("../typeorm/user.entity");
const channel_user_muted_entity_1 = require("../typeorm/channel-user-muted.entity");
let ChatModule = class ChatModule {
};
ChatModule = __decorate([
    (0, common_1.Module)({
        providers: [chat_gateway_1.ChatGateway, chat_service_1.ChatService],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([message_entity_1.Message, channel_entity_1.Channel, user_entity_1.User, channel_user_muted_entity_1.ChannelUserMuted]),
        ],
    })
], ChatModule);
exports.ChatModule = ChatModule;
//# sourceMappingURL=chat.module.js.map