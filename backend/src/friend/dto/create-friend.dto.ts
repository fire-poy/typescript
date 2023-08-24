import { IsNotEmpty } from 'class-validator'

export class CreateFriendDto {
    @IsNotEmpty()
    friendId: number

    @IsNotEmpty()
    isPending: boolean
}
