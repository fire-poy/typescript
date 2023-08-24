import { CreatePongDto } from './create-pong.dto';
declare const UpdatePongDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePongDto>>;
export declare class UpdatePongDto extends UpdatePongDto_base {
    id: number;
}
export {};
