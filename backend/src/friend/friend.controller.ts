import {
    Controller,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    BadRequestException,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { FriendService } from './friend.service'
import { UpdateFriendDto } from './dto/update-friend.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('friend')
@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Post('create/:id')
    async create(@Request() req: any, @Param('id') id: string) {
        try {
            await this.friendService.create(req, +id)
            return { 'Friendship request successfully submitted': 'true' }
        } catch (error) {
            throw new BadRequestException()
        }
    }

    @Patch('accept/:id')
    @UsePipes(ValidationPipe)
    async accept(
        @Param('id') id: string,
        @Body() updateFriendDto: UpdateFriendDto
    ) {
        try {
            await this.friendService.accept(+id, updateFriendDto)
            return { 'Friendship successfully accepted': 'true' }
        } catch (error) {
            throw new BadRequestException()
        }
    }

    @Delete('delete/:id')
    async remove(@Param('id') id: string) {
        try {
            await this.friendService.remove(+id)
            return { 'Friendship successfully removed': 'true' }
        } catch (error) {
            throw new BadRequestException()
        }
    }
}
