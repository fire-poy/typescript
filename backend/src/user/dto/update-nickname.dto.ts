import { IsNotEmpty } from 'class-validator'

export class UpdateNicknameDto {
    @IsNotEmpty()
    nickname: string
}
