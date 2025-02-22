import { Module } from '@nestjs/common';
import { UserService } from './domain/services/user.services';
import { UserController } from './infrastructure/adapters/persistence/user/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../shared/entities/user.entity';
import { UserUseCase } from "./application/use-cases/register-user.use-case";
import { MongooseUserRepository } from "./infrastructure/adapters/persistence/database/mongoose-user.repository";
import { JwtModule } from "@nestjs/jwt";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.register({
            global: true,
            secret: 'test',
            signOptions: { expiresIn: '1h' },
        }),
        ClientsModule.register([
            {
                name: 'USER_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'user',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'user-consumer',
                    },
                },
            },
        ]),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserUseCase,
        {
            provide: 'UserRepository',
            useClass: MongooseUserRepository,
        },
    ],
})
export class UserModule {}