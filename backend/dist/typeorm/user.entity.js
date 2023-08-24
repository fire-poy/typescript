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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const channel_entity_1 = require("./channel.entity");
const friend_entity_1 = require("./friend.entity");
const match_entity_1 = require("./match.entity");
const channel_user_muted_entity_1 = require("./channel-user-muted.entity");
var UserStatus;
(function (UserStatus) {
    UserStatus["Online"] = "online";
    UserStatus["Offline"] = "offline";
    UserStatus["Playing"] = "playing";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
let User = User_1 = class User {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, nickname: { required: true, type: () => String }, avatarUrl: { required: true, type: () => String }, nbVictory: { required: true, type: () => Number }, totalPlay: { required: true, type: () => Number }, xp: { required: true, type: () => Number }, TFASecret: { required: true, type: () => String }, TFAEnabled: { required: true, type: () => Boolean }, FT_id: { required: true, type: () => String }, status: { required: true, enum: require("./user.entity").UserStatus }, ownedChannels: { required: true, type: () => [require("./channel.entity").Channel] }, joinedChannel: { required: true, type: () => [require("./channel.entity").Channel] }, admin: { required: true, type: () => [require("./channel.entity").Channel] }, banned: { required: true, type: () => [require("./channel.entity").Channel] }, muted: { required: true, type: () => [require("./channel-user-muted.entity").ChannelUserMuted] }, friends: { required: true, type: () => [require("./friend.entity").Friend] }, friendOf: { required: true, type: () => [require("./friend.entity").Friend] }, matchLost: { required: true, type: () => [require("./match.entity").Match] }, matchWon: { required: true, type: () => [require("./match.entity").Match] }, createdFriends: { required: true, type: () => [require("./friend.entity").Friend] }, blockedUsers: { required: true, type: () => [require("./user.entity").User] }, blockedBy: { required: true, type: () => [require("./user.entity").User] } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        type: 'text',
    }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], User.prototype, "avatarUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "nbVictory", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "totalPlay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "xp", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], User.prototype, "TFASecret", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "TFAEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], User.prototype, "FT_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.Online,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_entity_1.Channel, (channel) => channel.owner),
    __metadata("design:type", Array)
], User.prototype, "ownedChannels", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => channel_entity_1.Channel, (channel) => channel.users),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "joinedChannel", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => channel_entity_1.Channel, (channel) => channel.admin),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => channel_entity_1.Channel, (channel) => channel.banned),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "banned", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_user_muted_entity_1.ChannelUserMuted, (channelUserMuted) => channelUserMuted.user),
    __metadata("design:type", Array)
], User.prototype, "muted", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => friend_entity_1.Friend, (friend) => friend.user),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => friend_entity_1.Friend, (friend) => friend.friend),
    __metadata("design:type", Array)
], User.prototype, "friendOf", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, (match) => match.loser),
    __metadata("design:type", Array)
], User.prototype, "matchLost", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, (match) => match.winner),
    __metadata("design:type", Array)
], User.prototype, "matchWon", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => friend_entity_1.Friend, (friend) => friend.createdBy),
    __metadata("design:type", Array)
], User.prototype, "createdFriends", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1, (user) => user.blockedBy),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], User.prototype, "blockedUsers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1, (user) => user.blockedUsers),
    __metadata("design:type", Array)
], User.prototype, "blockedBy", void 0);
User = User_1 = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map