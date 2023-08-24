import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-oauth2'
import { UserService } from 'src/user/user.service'
import { AuthService } from '../auth.service'

@Injectable()
export class Auth42Strategy extends PassportStrategy(Strategy, 'oauth') {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.FT_UUID,
            clientSecret: process.env.FT_SECRET,
            callbackURL: `${process.env.URL_BACKEND}/api/auth/42/redirect`,
        })
    }

    async validate(accessToken: string): Promise<any> {
        try {
            const user = await this.getUserProfile(accessToken)
            if (!user) {
                throw new UnauthorizedException()
            }
            const new_user = await this.authService.validateUser(user)
            return new_user
        } catch (error) {
            if (
                error.response &&
                error.response.status === 'already_connected'
            ) {
                return {
                    redirect: `${process.env.URL_FRONTEND}?error=already_connected`,
                }
            }
            throw error
        }
    }

    private async getUserProfile(accessToken: string) {
        const res = await fetch('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })

        if (!res.ok) {
            throw new Error(
                `Failed to fetch user profile from 42 API: ${res.status}`
            )
        }
        const data = await res.json()
        return {
            nickname: data.login,
            avatarUrl: data.image.versions.small,
            FT_id: data.id,
        }
    }
}
