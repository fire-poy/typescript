import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    UploadedFile,
    Res,
    Request,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Express } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { UpdateNicknameDto } from './dto/update-nickname.dto'
import { v4 as uuidv4 } from 'uuid'
import { extname } from 'path'
import { Response } from 'express'
import { Public } from 'src/decorators/public.decorator'
import { UpdatePlayersStatsDto } from './dto/update-player-stats.dto'

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return await this.userService.create(createUserDto)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    @Get('id/:id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.userService.findOne(+id)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Public()
    @Get('me')
    async getMyInfo(@Request() req: any) {
        try {
            return await this.userService.getMyInfo(req)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Get('getFriendsAndRequests')
    async getFriendsAndRequests(@Request() req: any) {
        try {
            return await this.userService.getFriendsAndRequests(req)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Get('getallnonfriendusers')
    async getOtherUsers(@Request() req: any) {
        try {
            return await this.userService.getAllUsersWithNoFriendship(req)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Get('nickname/:nickname')
    async getLambda(@Param('nickname') nickname: string) {
        try {
            return await this.userService.getLambdaInfo(nickname)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Post('updatenickname')
    @UsePipes(ValidationPipe)
    async updateNickname(
        @Request() req: any,
        @Body() updateNicknameDto: UpdateNicknameDto
    ) {
        try {
            return await this.userService.updateNickname(req, updateNicknameDto)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Post('logout')
    async logout(@Request() req: any, @Res() res: any) {
        try {
            return await this.userService.logout(req, res)
        } catch (error) {
            throw new NotFoundException()
        }
    }

    @Post('upload-profile-picture')
    @UseInterceptors(
        FileInterceptor('profilePicture', {
            storage: diskStorage({
                destination: './uploads/tmp-profil-pictures-storage',
                filename: (req, file, cb) => {
                    const uniqueSuffix = uuidv4()
                    const fileExt = extname(file.originalname)
                    cb(null, `${Date.now()}-${uniqueSuffix}${fileExt}`)
                },
            }),
        })
    )
    async uploadProfilePicture(
        @Request() req: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) {
            console.log('No image was provided')
        }
        try {
            const photoUrl = await this.userService.uploadProfilePicture(
                req,
                file
            )
            return { message: 'Profile image saved correctly', photoUrl }
        } catch (error) {
            throw new InternalServerErrorException(
                'An error occurred when saving the profile image'
            )
        }
    }

    @Get('picture/:filename')
    async getPhoto(@Param('filename') filename, @Res() res) {
        res.sendFile(filename, { root: './uploads' })
    }

    @Get('profile-images/:filename')
    async serveProfileImage(
        @Param('filename') filename: string,
        @Res() res: Response
    ) {
        res.sendFile(filename, { root: '/app/profile-images' })
    }

    @Get('isBlockedByMe/:id')
    async isBlockedByMe(@Param('id') target_id: string, @Request() req: any) {
        try {
            return await this.userService.isBlockedByMe(req, +target_id)
        } catch (error) {
            console.log('Failed to get blocked User')
        }
    }

    @Post('block/:id')
    async blockUser(@Param('id') target_id: string, @Request() req: any) {
        try {
            await this.userService.blockUser(req.user.id, +target_id)
            return { message: 'User blocked successfully' }
        } catch (error) {
            console.log('Failed to block user')
        }
    }

    @Delete('unblock/:id')
    async unblockUser(@Param('id') target_id: string, @Request() req: any) {
        try {
            await this.userService.unblockUser(req.user.id, +target_id)
            return { message: 'User unblocked successfully' }
        } catch (error) {
            console.log('Failed to unblock user')
        }
    }

    @Post('updatePlayersStats')
    @UsePipes(ValidationPipe)
    async updatePlayersStats(
        @Body() updatePlayersStatsDto: UpdatePlayersStatsDto
    ) {
        try {
            await this.userService.updatePlayersStats(updatePlayersStatsDto)
            return { message: 'Players stats updated successfully' }
        } catch (error) {
            console.log('Failed to update players stats')
        }
    }
}
