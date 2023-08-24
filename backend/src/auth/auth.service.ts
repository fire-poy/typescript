import {
    Injectable,
    Request,
    NotFoundException,
    UnauthorizedException,
    Body,
} from '@nestjs/common'
import { User } from '../types/User'
import { authenticator } from 'otplib'
import { UserService } from 'src/user/user.service'
import { toDataURL } from 'qrcode'
import { UserStatus } from 'src/typeorm/user.entity'

function generateRandomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let result = ''

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters.charAt(randomIndex)
    }

    return result
}

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async validateUser(user42) {
        let user = await this.userService.findByFT_id(user42.FT_id)
        if (!user) {
            let newNickname = user42.nickname
            const userSameNickname = await this.userService.findByNickname(
                user42.nickname
            )
            if (userSameNickname) newNickname = generateRandomString()
            user = await this.userService.create({
                FT_id: user42.FT_id,
                nickname: newNickname,
                avatarUrl: user42.avatarUrl,
                status: UserStatus.Online,
            })
        } else if (user.status !== UserStatus.Offline) {
            throw new UnauthorizedException('already_connected')
        } else {
            await this.userService.changeStatusOnLine(user.id)
        }
        return user
    }

    async generateTwoFactorAuthenticationSecret(user: User) {
        const secret: string = authenticator.generateSecret()

        const otpauthUrl: string = authenticator.keyuri(
            user.nickname,
            'COSMIC_PONG',
            secret
        )

        await this.userService.setTwoFactorAuthenticationSecret(secret, user.id)

        return {
            secret,
            otpauthUrl,
        }
    }

    async findUser(ft_id: number): Promise<any> {
        let user = await this.userService.findOne(ft_id)
        return user
    }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl)
    }

    isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCode: string,
        User: User
    ): boolean {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: User.TFASecret,
        })
    }

    async authenticateTOTP(@Request() req: any, @Body() body) {
        const user = await this.userService.findOne(req.user.id)

        if (!user) {
            throw new NotFoundException('User not found')
        }
        const isCodeValid = this.isTwoFactorAuthenticationCodeValid(
            body.twoFactorAuthenticationCode,
            user
        )

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code')
        }

        req.session.needTFA = false
        return true
    }

    async activate2fa(@Request() req: any, @Body() body) {
        const user = await this.userService.findOne(req.user.id)

        if (!user) {
            throw new NotFoundException('User not found')
        }
        const isCodeValid = this.isTwoFactorAuthenticationCodeValid(
            body.twoFactorAuthenticationCode,
            user
        )

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code')
        }

        this.userService.turnOnTwoFactorAuthentication(user.id)

        req.user.TFAEnabled = true

        return true
    }

    async deactivate2fa(@Request() req: any) {
        const user = await this.userService.findOne(req.user.id)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        this.userService.turnOffTwoFactorAuthentication(user.id)

        req.user.TFAEnabled = false

        return true
    }

    async generateQR(@Request() req: any) {
        const user = await this.userService.findOne(req.user.id)

        if (!user) {
            throw new NotFoundException('User not found')
        }
        const secretAndUrl = await this.generateTwoFactorAuthenticationSecret(
            user
        )

        const qrCode = await this.generateQrCodeDataURL(secretAndUrl.otpauthUrl)
        return qrCode
    }
}
