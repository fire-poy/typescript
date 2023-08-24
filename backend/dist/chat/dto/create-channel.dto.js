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
exports.CreateChannelDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../typeorm/user.entity");
class CreateChannelDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { owner: { required: true, type: () => require("../../typeorm/user.entity").User }, ownerId: { required: true, type: () => Number }, name: { required: true, type: () => String }, type: { required: true, type: () => String }, password: { required: true, type: () => String }, admin: { required: true, type: () => [require("../../typeorm/user.entity").User] }, users: { required: true, type: () => [require("../../typeorm/user.entity").User] }, messages: { required: true, type: () => [require("../../typeorm/message.entity").Message] } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", user_entity_1.User)
], CreateChannelDto.prototype, "owner", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateChannelDto.prototype, "ownerId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateChannelDto.prototype, "admin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateChannelDto.prototype, "users", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateChannelDto.prototype, "messages", void 0);
exports.CreateChannelDto = CreateChannelDto;
//# sourceMappingURL=create-channel.dto.js.map