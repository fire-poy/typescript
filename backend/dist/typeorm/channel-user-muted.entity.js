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
exports.ChannelUserMuted = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("typeorm");
const channel_entity_1 = require("./channel.entity");
const user_entity_1 = require("./user.entity");
let ChannelUserMuted = class ChannelUserMuted {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, channel: { required: true, type: () => require("./channel.entity").Channel }, user: { required: true, type: () => require("./user.entity").User }, mutedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelUserMuted.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channel, (channel) => channel.muted, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_2.JoinColumn)({ name: 'channelId' }),
    __metadata("design:type", channel_entity_1.Channel)
], ChannelUserMuted.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.muted, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_2.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], ChannelUserMuted.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChannelUserMuted.prototype, "mutedAt", void 0);
ChannelUserMuted = __decorate([
    (0, typeorm_1.Entity)()
], ChannelUserMuted);
exports.ChannelUserMuted = ChannelUserMuted;
//# sourceMappingURL=channel-user-muted.entity.js.map