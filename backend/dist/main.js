"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const generateSessionSecret = () => {
    const secretLength = 32;
    return crypto.randomBytes(secretLength).toString('hex');
};
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.URL_FRONTEND,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Cookie, Set-Cookie',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.use(session({
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
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        next();
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CosmicPong API')
        .setDescription('The coolest way to play pong and test our skills as developers at the same time')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('swagger', app, document);
    await app.listen(3000);
}
bootstrap().catch((error) => console.error(error));
//# sourceMappingURL=main.js.map