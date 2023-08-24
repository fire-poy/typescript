"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePongDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_pong_dto_1 = require("./create-pong.dto");
class UpdatePongDto extends (0, mapped_types_1.PartialType)(create_pong_dto_1.CreatePongDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number } };
    }
}
exports.UpdatePongDto = UpdatePongDto;
//# sourceMappingURL=update-pong.dto.js.map