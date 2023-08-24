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
exports.Channel = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const message_entity_1 = require("./message.entity");
const channel_user_muted_entity_1 = require("./channel-user-muted.entity");
let Channel = class Channel {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, owner: { required: true, type: () => require("./user.entity").User }, name: { required: true, type: () => String }, type: { required: true, type: () => String }, password: { required: true, type: () => String }, creationDate: { required: true, type: () => Date }, users: { required: true, type: () => [require("./user.entity").User] }, admin: { required: true, type: () => [require("./user.entity").User] }, banned: { required: true, type: () => [require("./user.entity").User] }, muted: { required: true, type: () => [require("./channel-user-muted.entity").ChannelUserMuted] }, messages: { required: true, type: () => [require("./message.entity").Message] } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Channel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ownedChannels),
    (0, typeorm_1.JoinColumn)({ name: 'ownedChannels' }),
    __metadata("design:type", user_entity_1.User)
], Channel.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500 }),
    __metadata("design:type", String)
], Channel.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], Channel.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Channel.prototype, "creationDate", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.joinedChannel),
    __metadata("design:type", Array)
], Channel.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.admin),
    __metadata("design:type", Array)
], Channel.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.banned),
    __metadata("design:type", Array)
], Channel.prototype, "banned", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_user_muted_entity_1.ChannelUserMuted, (channelUserMuted) => channelUserMuted.channel),
    __metadata("design:type", Array)
], Channel.prototype, "muted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (message) => message.channelId),
    (0, typeorm_1.JoinColumn)({ name: 'messages' }),
    __metadata("design:type", Array)
], Channel.prototype, "messages", void 0);
Channel = __decorate([
    (0, typeorm_1.Entity)()
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=channel.entity.js.map