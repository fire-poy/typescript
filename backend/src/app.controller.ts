import { Controller, Get, Request } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    async getHello(@Request() req: any): Promise<string> {
        await this.appService.seed(req.user.id)
        return 'Seed complete'
    }
}
