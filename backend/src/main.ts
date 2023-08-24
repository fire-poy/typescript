import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as session from 'express-session'
import * as passport from 'passport'
import * as crypto from 'crypto'

const generateSessionSecret = () => {
    const secretLength = 32 // Secret length in bytes
    return crypto.randomBytes(secretLength).toString('hex')
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')

    app.enableCors({
        origin: process.env.URL_FRONTEND,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Cookie, Set-Cookie',
        credentials: true,
    })

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    )

    app.use(
        session({
            secret: generateSessionSecret(),
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 3600000,
                sameSite: 'lax',
                httpOnly: true,
                secure: false,
                path: '/',
            },
        })
    )
    app.use(passport.initialize())
    app.use(passport.session())
    app.use((req, res, next) => {
        next()
    })

    const config = new DocumentBuilder()
        .setTitle('CosmicPong API')
        .setDescription(
            'The coolest way to play pong and test our skills as developers at the same time'
        )
        .setVersion('1.0')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('swagger', app, document)

    await app.listen(3000)
}

bootstrap().catch((error) => console.error(error))
