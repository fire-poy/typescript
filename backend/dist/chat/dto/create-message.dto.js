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
exports.CreateMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const channel_entity_1 = require("../../typeorm/channel.entity");
class CreateMessageDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { creator: { required: true, type: () => Number }, content: { required: true, type: () => String }, channelId: { required: true, type: () => Number }, creationDate: { required: true, type: () => Date }, channel: { required: true, type: () => require("../../typeorm/channel.entity").Channel }, userNickname: { required: true, type: () => String }, userAvatarUrl: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMessageDto.prototype, "creator", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMessageDto.prototype, "channelId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateMessageDto.prototype, "creationDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", channel_entity_1.Channel)
], CreateMessageDto.prototype, "channel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "userNickname", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "userAvatarUrl", void 0);
exports.CreateMessageDto = CreateMessageDto;
//# sourceMappingURL=create-message.dto.js.map