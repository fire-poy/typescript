import {
    UseGuards,
    Controller,
    Req,
    Res,
    Get,
    Post,
    Body,
    Request,
} from '@nestjs/common'
import { OauthGuard } from './guards/oauth.guard'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { TotpGuard } from './guards/totp.guard'
import { Activate2faGuard } from './guards/activate2fa.guard'
import { UserService } from 'src/user/user.service'
import { Public } from 'src/decorators/public.decorator'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Public()
    @Get('42')
    @UseGuards(OauthGuard)
    async login() {}

    @Public()
    @Get('42/redirect')
    @UseGuards(OauthGuard)
    loginRedirect(@Req() req, @Res() res) {
        if (req.session.needTFA === true)
            res.redirect(`${process.env.URL_FRONTEND}/TFAVerify`)
        else res.redirect(`${process.env.URL_FRONTEND}/profile`)
        return req.user
    }

    @Public()
    @Get('loginStatus')
    getStatus(@Req() req) {
        return this.userService.logStatus(req)
    }

    @Public()
    @Post('2fa/turn-on')
    @UseGuards(Activate2faGuard)
    async activate2fa(@Request() req: any, @Body() body) {
        return await this.authService.activate2fa(req, body)
    }

    @Public()
    @Post('2fa/turn-off')
    async deactivate2fa(@Request() req: any) {
        return await this.authService.deactivate2fa(req)
    }

    @Public()
    @Post('2fa/authenticate')
    @UseGuards(TotpGuard)
    async authenticateTOTP(@Request() req: any, @Body() body) {
        return await this.authService.authenticateTOTP(req, body)
    }

    @Public()
    @Get('2fa/generate')
    @UseGuards(Activate2faGuard)
    async generateQR(@Request() req: any) {
        return await this.authService.generateQR(req)
    }
}
