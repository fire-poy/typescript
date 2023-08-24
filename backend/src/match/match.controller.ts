import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ValidationPipe,
    UsePipes,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { MatchService } from './match.service'
import { CreateMatchDto } from './dto/create-match.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('match')
@Controller('match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() createMatchDto: CreateMatchDto) {
        try {
            return await this.matchService.create(createMatchDto)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    @Get('user/:id')
    async findByUserId(@Param('id') id: string) {
        try {
            return await this.matchService.findByUserId(+id)
        } catch (error) {
            throw new NotFoundException()
        }
    }
}
